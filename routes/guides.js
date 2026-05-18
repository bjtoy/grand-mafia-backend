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

// GET ALL GUIDES (public)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT *
            FROM guides
            ORDER BY updatedAt DESC
        `);

        res.json({
            success: true,
            guides: rows
        });

    } catch (error) {
        console.error('Error fetching guides:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET GUIDE BY ID (public)
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM guides WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Guide not found'
            });
        }

        res.json({
            success: true,
            guide: rows[0]
        });

    } catch (error) {
        console.error('Error fetching guide:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// ============================================
// PROTECTED ROUTES — MOD + ADMIN
// ============================================

// CREATE GUIDE
router.post(
    '/',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('CREATE_GUIDE'),
    async (req, res) => {
        const { title, content, category } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'title and content are required'
            });
        }

        try {
            const [result] = await pool.query(
                `
                INSERT INTO guides (title, content, category)
                VALUES (?, ?, ?)
                `,
                [title, content, category || null]
            );

            res.json({
                success: true,
                id: result.insertId
            });

        } catch (error) {
            console.error('Error creating guide:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// UPDATE GUIDE
router.put(
    '/:id',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('EDIT_GUIDE'),
    async (req, res) => {
        const { title, content, category } = req.body;

        try {
            const [result] = await pool.query(
                `
                UPDATE guides
                SET title = ?, content = ?, category = ?, updatedAt = CURRENT_TIMESTAMP
                WHERE id = ?
                `,
                [title, content, category || null, req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Guide not found'
                });
            }

            res.json({
                success: true,
                message: 'Guide updated'
            });

        } catch (error) {
            console.error('Error updating guide:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// DELETE GUIDE
router.delete(
    '/:id',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('DELETE_GUIDE'),
    async (req, res) => {
        try {
            const [result] = await pool.query(
                'DELETE FROM guides WHERE id = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Guide not found'
                });
            }

            res.json({
                success: true,
                message: 'Guide deleted'
            });

        } catch (error) {
            console.error('Error deleting guide:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// PUBLISH GUIDE
router.post(
    '/:id/publish',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('PUBLISH_GUIDE'),
    async (req, res) => {
        try {
            const [result] = await pool.query(
                `
                UPDATE guides
                SET published = 1, updatedAt = CURRENT_TIMESTAMP
                WHERE id = ?
                `,
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Guide not found'
                });
            }

            res.json({
                success: true,
                message: 'Guide published'
            });

        } catch (error) {
            console.error('Error publishing guide:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

module.exports = router;
