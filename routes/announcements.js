const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Permission middleware
const {
    requireAnyRole,
    requirePermission
} = require('../middleware/auth-middleware');

// ============================================
// PUBLIC ROUTES — READ ONLY
// ============================================

// GET ALL ANNOUNCEMENTS (public)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT *
            FROM announcements
            ORDER BY createdAt DESC
        `);

        res.json({
            success: true,
            announcements: rows
        });

    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET ANNOUNCEMENT BY ID (public)
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM announcements WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        res.json({
            success: true,
            announcement: rows[0]
        });

    } catch (error) {
        console.error('Error fetching announcement:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// ============================================
// PROTECTED ROUTES — MOD + ADMIN
// ============================================

// CREATE ANNOUNCEMENT
router.post(
    '/',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('CREATE_ANNOUNCEMENT'),
    async (req, res) => {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'title and content are required'
            });
        }

        try {
            const [result] = await pool.query(
                `
                INSERT INTO announcements (title, content)
                VALUES (?, ?)
                `,
                [title, content]
            );

            res.json({
                success: true,
                id: result.insertId
            });

        } catch (error) {
            console.error('Error creating announcement:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// UPDATE ANNOUNCEMENT
router.put(
    '/:id',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('EDIT_ANNOUNCEMENT'),
    async (req, res) => {
        const { title, content } = req.body;

        try {
            const [result] = await pool.query(
                `
                UPDATE announcements
                SET title = ?, content = ?, updatedAt = CURRENT_TIMESTAMP
                WHERE id = ?
                `,
                [title, content, req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Announcement not found'
                });
            }

            res.json({
                success: true,
                message: 'Announcement updated'
            });

        } catch (error) {
            console.error('Error updating announcement:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// DELETE ANNOUNCEMENT
router.delete(
    '/:id',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('DELETE_ANNOUNCEMENT'),
    async (req, res) => {
        try {
            const [result] = await pool.query(
                'DELETE FROM announcements WHERE id = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Announcement not found'
                });
            }

            res.json({
                success: true,
                message: 'Announcement deleted'
            });

        } catch (error) {
            console.error('Error deleting announcement:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// POST ANNOUNCEMENT (mark as posted)
router.post(
    '/:id/post',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('POST_ANNOUNCEMENT'),
    async (req, res) => {
        try {
            const [result] = await pool.query(
                `
                UPDATE announcements
                SET posted = 1, updatedAt = CURRENT_TIMESTAMP
                WHERE id = ?
                `,
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Announcement not found'
                });
            }

            res.json({
                success: true,
                message: 'Announcement posted'
            });

        } catch (error) {
            console.error('Error posting announcement:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

module.exports = router;
