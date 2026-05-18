const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Permission middleware
const {
    requireAnyRole,
    requirePermission
} = require('../middleware/auth-middleware');

// ============================================
// PUBLIC / READ-ONLY ROUTES
// Members are synced automatically by the
// Role Sync Engine. Manual edits are restricted.
// ============================================

// GET ALL MEMBERS (public)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT *
            FROM members
            ORDER BY id DESC
        `);

        res.json({
            success: true,
            members: rows
        });

    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET MEMBER BY ID (public)
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM members WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        res.json({
            success: true,
            member: rows[0]
        });

    } catch (error) {
        console.error('Error fetching member:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// ============================================
// PROTECTED ROUTES (DISABLED IN SECTION D)
// Member creation, updates, and deletion are
// handled automatically by the Role Sync Engine.
// ============================================

// CREATE MEMBER (DISABLED)
router.post(
    '/',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('MANAGE_MEMBERS'),
    (req, res) => {
        return res.status(403).json({
            success: false,
            message: 'Members cannot be created manually. They are created automatically when they join the server or log in.'
        });
    }
);

// UPDATE MEMBER (DISABLED)
router.put(
    '/:id',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('MANAGE_MEMBERS'),
    (req, res) => {
        return res.status(403).json({
            success: false,
            message: 'Members cannot be updated manually. Their data is synced automatically from Discord.'
        });
    }
);

// DELETE MEMBER (DISABLED)
router.delete(
    '/:id',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('MANAGE_MEMBERS'),
    (req, res) => {
        return res.status(403).json({
            success: false,
            message: 'Members cannot be deleted manually. They are managed automatically by the Role Sync Engine.'
        });
    }
);

module.exports = router;
