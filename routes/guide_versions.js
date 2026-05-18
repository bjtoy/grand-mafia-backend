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

// GET ALL VERSIONS FOR A GUIDE (public)
router.get('/guide/:guideId', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `
            SELECT *
            FROM guide_versions
            WHERE guideId = ?
            ORDER BY createdAt DESC
            `,
            [req.params.guideId]
        );

        res.json({
            success: true,
            versions: rows
        });

    } catch (error) {
        console.error('Error fetching guide versions:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET SPECIFIC VERSION (public)
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

        res.json({
            success: true,
            version: rows[0]
        });

    } catch (error) {
        console.error('Error fetching guide version:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// ============================================
// PROTECTED ROUTES — MOD + ADMIN
// ============================================

// CREATE NEW VERSION
router.post(
    '/',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('MANAGE_GUIDES'),
    async (req, res) => {
        const { guideId, title, content } = req.body;

        if (!guideId || !title || !content) {
            return res.status(400).json({
                success: false,
                message: 'guideId, title, and content are required'
            });
        }

        try {
            const [result] = await pool.query(
                `
                INSERT INTO guide_versions (guideId, title, content)
                VALUES (?, ?, ?)
                `,
                [guideId, title, content]
            );

            res.json({
                success: true,
                id: result.insertId
            });

        } catch (error) {
            console.error('Error creating guide version:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// UPDATE VERSION
router.put(
    '/:id',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('MANAGE_GUIDES'),
    async (req, res) => {
        const { title, content } = req.body;

        try {
            const [result] = await pool.query(
                `
                UPDATE guide_versions
                SET title = ?, content = ?, updatedAt = CURRENT_TIMESTAMP
                WHERE id = ?
                `,
                [title, content, req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Guide version not found'
                });
            }

            res.json({
                success: true,
                message: 'Guide version updated'
            });

        } catch (error) {
            console.error('Error updating guide version:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// DELETE VERSION
router.delete(
    '/:id',
    requireAnyRole(['Admin', 'Mod']),
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

            res.json({
                success: true,
                message: 'Guide version deleted'
            });

        } catch (error) {
            console.error('Error deleting guide version:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

module.exports = router;
