const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Internal roles
const INTERNAL_ROLES = require('../config/roles');

// Permission middleware
const {
    requireAnyRole,
    requirePermission
} = require('../middleware/auth-middleware');

// ============================================
// READ-ONLY MEMBER ROLE API (SECTION D)
// Roles are now synced automatically by the
// Role Sync Engine. Manual edits are disabled.
// ============================================

// GET all member-role links (public)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT mr.*, r.name AS roleName
            FROM member_roles mr
            JOIN roles r ON r.id = mr.roleId
            ORDER BY mr.memberId ASC
        `);

        res.json({
            success: true,
            member_roles: rows
        });

    } catch (error) {
        console.error('Error fetching member_roles:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET all roles for a specific member (public)
router.get('/member/:memberId', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT r.*
            FROM member_roles mr
            JOIN roles r ON r.id = mr.roleId
            WHERE mr.memberId = ?
        `, [req.params.memberId]);

        res.json({
            success: true,
            roles: rows
        });

    } catch (error) {
        console.error('Error fetching roles for member:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET all members with a specific role (public)
router.get('/role/:roleId', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT m.*
            FROM member_roles mr
            JOIN members m ON m.id = mr.memberId
            WHERE mr.roleId = ?
        `, [req.params.roleId]);

        res.json({
            success: true,
            members: rows
        });

    } catch (error) {
        console.error('Error fetching members for role:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// ============================================
// PROTECTED ROUTES (DISABLED IN SECTION D)
// Member roles cannot be manually edited.
// ============================================

// ASSIGN a role to a member (DISABLED)
router.post(
    '/',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('MANAGE_ROLES'),
    (req, res) => {
        return res.status(403).json({
            success: false,
            message: 'Member roles cannot be assigned manually. Roles are synced automatically from Discord.'
        });
    }
);

// REMOVE a role from a member (DISABLED)
router.delete(
    '/',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('MANAGE_ROLES'),
    (req, res) => {
        return res.status(403).json({
            success: false,
            message: 'Member roles cannot be removed manually. Roles are synced automatically from Discord.'
        });
    }
);

module.exports = router;
