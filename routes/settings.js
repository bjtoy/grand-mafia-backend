const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Permission middleware
const {
    requireRole,
    requirePermission
} = require('../middleware/auth-middleware');

// ============================================
// SETTINGS = ADMIN ONLY
// ============================================

// GET ALL SETTINGS (Admin only)
router.get(
    '/',
    requireRole('Admin'),
    requirePermission('MANAGE_SETTINGS'),
    async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT *
                FROM settings
                ORDER BY id ASC
            `);

            res.json({
                success: true,
                settings: rows
            });

        } catch (error) {
            console.error('Error fetching settings:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// UPDATE A SETTING (Admin only)
router.put(
    '/:id',
    requireRole('Admin'),
    requirePermission('MANAGE_SETTINGS'),
    async (req, res) => {
        const { value } = req.body;

        if (value === undefined) {
            return res.status(400).json({
                success: false,
                message: 'value is required'
            });
        }

        try {
            const [result] = await pool.query(
                `
                UPDATE settings
                SET value = ?, updatedAt = CURRENT_TIMESTAMP
                WHERE id = ?
                `,
                [value, req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Setting not found'
                });
            }

            res.json({
                success: true,
                message: 'Setting updated'
            });

        } catch (error) {
            console.error('Error updating setting:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// CREATE NEW SETTING (Admin only)
router.post(
    '/',
    requireRole('Admin'),
    requirePermission('MANAGE_SETTINGS'),
    async (req, res) => {
        const { key, value } = req.body;

        if (!key || value === undefined) {
            return res.status(400).json({
                success: false,
                message: 'key and value are required'
            });
        }

        try {
            const [result] = await pool.query(
                `
                INSERT INTO settings (keyName, value)
                VALUES (?, ?)
                `,
                [key, value]
            );

            res.json({
                success: true,
                id: result.insertId
            });

        } catch (error) {
            console.error('Error creating setting:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// DELETE SETTING (Admin only)
router.delete(
    '/:id',
    requireRole('Admin'),
    requirePermission('MANAGE_SETTINGS'),
    async (req, res) => {
        try {
            const [result] = await pool.query(
                'DELETE FROM settings WHERE id = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Setting not found'
                });
            }

            res.json({
                success: true,
                message: 'Setting deleted'
            });

        } catch (error) {
            console.error('Error deleting setting:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

module.exports = router;
