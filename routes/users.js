const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Permission middleware
const {
    requireRole,
    requirePermission
} = require('../middleware/auth-middleware');

// ============================================
// USERS = DASHBOARD ACCOUNTS (NOT DISCORD)
// Admin-only access
// ============================================

// GET ALL USERS (Admin only)
router.get(
    '/',
    requireRole('Admin'),
    requirePermission('MANAGE_USERS'),
    async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT id, username, email, createdAt, updatedAt
                FROM users
                ORDER BY id DESC
            `);

            res.json({
                success: true,
                users: rows
            });

        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// GET USER BY ID (Admin only)
router.get(
    '/:id',
    requireRole('Admin'),
    requirePermission('MANAGE_USERS'),
    async (req, res) => {
        try {
            const [rows] = await pool.query(
                'SELECT id, username, email, createdAt, updatedAt FROM users WHERE id = ?',
                [req.params.id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                user: rows[0]
            });

        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// CREATE USER (Admin only)
router.post(
    '/',
    requireRole('Admin'),
    requirePermission('MANAGE_USERS'),
    async (req, res) => {
        const { username, email, passwordHash } = req.body;

        if (!username || !email || !passwordHash) {
            return res.status(400).json({
                success: false,
                message: 'username, email, and passwordHash are required'
            });
        }

        try {
            const [result] = await pool.query(
                `
                INSERT INTO users (username, email, passwordHash)
                VALUES (?, ?, ?)
                `,
                [username, email, passwordHash]
            );

            res.json({
                success: true,
                id: result.insertId
            });

        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// UPDATE USER (Admin only)
router.put(
    '/:id',
    requireRole('Admin'),
    requirePermission('MANAGE_USERS'),
    async (req, res) => {
        const { username, email, passwordHash } = req.body;

        try {
            const [result] = await pool.query(
                `
                UPDATE users
                SET username = ?, email = ?, passwordHash = ?, updatedAt = CURRENT_TIMESTAMP
                WHERE id = ?
                `,
                [username, email, passwordHash, req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                message: 'User updated'
            });

        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// DELETE USER (Admin only)
router.delete(
    '/:id',
    requireRole('Admin'),
    requirePermission('MANAGE_USERS'),
    async (req, res) => {
        try {
            const [result] = await pool.query(
                'DELETE FROM users WHERE id = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                message: 'User deleted'
            });

        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

module.exports = router;
