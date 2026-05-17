const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Permission middleware
const {
    requireAnyRole,
    requirePermission
} = require('../auth-middleware');

// ============================================
// PUBLIC / MEMBER-SAFE ROUTES (READ ONLY)
// ============================================

// GET all moderation logs (public)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM moderation_log ORDER BY createdAt DESC'
        );
        res.json({ success: true, logs: rows });
    } catch (error) {
        console.error('Error fetching moderation logs:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET moderation log by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM moderation_log WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Moderation log not found'
            });
        }

        res.json({ success: true, log: rows[0] });
    } catch (error) {
        console.error('Error fetching moderation log:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// ============================================
// PROTECTED ROUTES (MODERATOR + ADMIN ONLY)
// ============================================

// CREATE moderation log entry
router.post(
    '/',
    requireAnyRole(['Admin', 'Moderator']),
    requirePermission('MANAGE_MODERATION'),
    async (req, res) => {
        const { action, targetUser, moderator, details } = req.body;

        if (!action || !targetUser || !moderator) {
            return res.status(400).json({
                success: false,
                message: 'action, targetUser, and moderator are required'
            });
        }

        try {
            const [result] = await pool.query(
                `INSERT INTO moderation_log 
                (action, targetUser, moderator, details) 
                VALUES (?, ?, ?, ?)`,
                [action, targetUser, moderator, details || null]
            );

            res.json({ success: true, id: result.insertId });
        } catch (error) {
            console.error('Error creating moderation log:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// UPDATE moderation log entry
router.put(
    '/:id',
    requireAnyRole(['Admin', 'Moderator']),
    requirePermission('MANAGE_MODERATION'),
    async (req, res) => {
        const { action, targetUser, moderator, details } = req.body;

        try {
            const [result] = await pool.query(
                `UPDATE moderation_log 
                 SET action = ?, targetUser = ?, moderator = ?, details = ?, updatedAt = CURRENT_TIMESTAMP 
                 WHERE id = ?`,
                [action, targetUser, moderator, details || null, req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Moderation log not found'
                });
            }

            res.json({ success: true, message: 'Moderation log updated' });
        } catch (error) {
            console.error('Error updating moderation log:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// DELETE moderation log entry
router.delete(
    '/:id',
    requireAnyRole(['Admin', 'Moderator']),
    requirePermission('MANAGE_MODERATION'),
    async (req, res) => {
        try {
            const [result] = await pool.query(
                'DELETE FROM moderation_log WHERE id = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Moderation log not found'
                });
            }

            res.json({ success: true, message: 'Moderation log deleted' });
        } catch (error) {
            console.error('Error deleting moderation log:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

module.exports = router;
