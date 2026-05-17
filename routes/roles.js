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

// GET all roles (public)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM roles ORDER BY createdAt DESC');
        res.json({ success: true, roles: rows });
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET role by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM roles WHERE id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        res.json({ success: true, role: rows[0] });
    } catch (error) {
        console.error('Error fetching role:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// ============================================
// PROTECTED ROUTES (MODERATOR + ADMIN ONLY)
// ============================================

// CREATE a new role
router.post(
    '/',
    requireAnyRole(['Admin', 'Moderator']),
    requirePermission('MANAGE_ROLES'),
    async (req, res) => {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Role name is required'
            });
        }

        try {
            const [result] = await pool.query(
                'INSERT INTO roles (name) VALUES (?)',
                [name]
            );

            res.json({ success: true, id: result.insertId });
        } catch (error) {
            console.error('Error creating role:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// DELETE a role
router.delete(
    '/:id',
    requireAnyRole(['Admin', 'Moderator']),
    requirePermission('MANAGE_ROLES'),
    async (req, res) => {
        try {
            const [result] = await pool.query(
                'DELETE FROM roles WHERE id = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Role not found'
                });
            }

            res.json({ success: true, message: 'Role deleted' });
        } catch (error) {
            console.error('Error deleting role:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

module.exports = router;
