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

// GET all guide versions (public)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM guide_versions ORDER BY createdAt DESC'
        );
        res.json({ success: true, versions: rows });
    } catch (error) {
        console.error('Error fetching guide versions:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET all versions for a specific guide (public)
router.get('/guide/:guideId', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM guide_versions WHERE guideId = ? ORDER BY createdAt DESC',
            [req.params.guideId]
        );

        res.json({ success: true, versions: rows });
    } catch (error) {
        console.error('Error fetching guide versions by guideId:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET a single version by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM guide_versions WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Guide version not found'
            });
        }

        res.json({ success: true, version: rows[0] });
    } catch (error) {
        console.error('Error fetching guide version:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// ============================================
// PROTECTED ROUTES (MODERATOR + ADMIN ONLY)
// ============================================

// CREATE a new guide version
router.post(
    '/',
    requireAnyRole(['Admin', 'Moderator']),
    requirePermission('MANAGE_GUIDES'),
    async (req, res) => {
        const { guideId, title, content, author } = req.body;

        if (!guideId || !title || !content) {
            return res.status(400).json({
                success: false,
                message: 'guideId, title, and content are required'
            });
        }

        try {
            const [result] = await pool.query(
                `INSERT INTO guide_versions 
                (guideId, title, content, author) 
                VALUES (?, ?, ?, ?)`,
                [guideId, title, content, author || null]
            );

            res.json({ success: true, id: result.insertId });
        } catch (error) {
            console.error('Error creating guide version:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// UPDATE a guide version
router.put(
    '/:id',
    requireAnyRole(['Admin', 'Moderator']),
    requirePermission('MANAGE_GUIDES'),
    async (req, res) => {
        const { title, content, author } = req.body;

        try {
            const [result] = await pool.query(
                `UPDATE guide_versions 
                 SET title = ?, content = ?, author = ?, updatedAt = CURRENT_TIMESTAMP 
                 WHERE id = ?`,
                [title, content, author || null, req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Guide version not found'
                });
            }

            res.json({ success: true, message: 'Guide version updated' });
        } catch (error) {
            console.error('Error updating guide version:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// DELETE a guide version
router.delete(
    '/:id',
    requireAnyRole(['Admin', 'Moderator']),
    requirePermission('MANAGE_GUIDES'),
    async (req, res) => {
        try {
            const [result] = await pool.query(
                'DELETE FROM guide_versions WHERE id = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Guide version not found'
                });
            }

            res.json({ success: true, message: 'Guide version deleted' });
        } catch (error) {
            console.error('Error deleting guide version:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

module.exports = router;
