const express = require('express');
const router = express.Router();
const prisma = require('../config/db');

// Internal roles + permissions
const INTERNAL_ROLES = require('../config/roles');

// Permission middleware
const {
    requireAnyRole,
    requirePermission
} = require('../middleware/auth-middleware');

// ============================================
// READ-ONLY ROLE API (SECTION D)
// Roles are now defined in config/roles.js
// and synced to DB automatically.
// ============================================

// GET all roles (public)
router.get('/', async (req, res) => {
    try {
        const roles = await prisma.role.findMany({
            orderBy: { name: 'asc' }
        });

        res.json({
            success: true,
            roles,
            internalRoles: INTERNAL_ROLES
        });

    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET role by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const role = await prisma.role.findUnique({
            where: { id: req.params.id }
        });

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        const internal = INTERNAL_ROLES[role.name] || null;

        res.json({
            success: true,
            role,
            internalDefinition: internal
        });

    } catch (error) {
        console.error('Error fetching role:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// ============================================
// PROTECTED ROUTES (DISABLED IN SECTION D)
// Roles cannot be created or deleted manually.
// ============================================

router.post(
    '/',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('MANAGE_ROLES'),
    (req, res) => {
        return res.status(403).json({
            success: false,
            message: 'Roles cannot be created manually. Edit config/roles.js instead.'
        });
    }
);

router.delete(
    '/:id',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('MANAGE_ROLES'),
    (req, res) => {
        return res.status(403).json({
            success: false,
            message: 'Roles cannot be deleted manually. Edit config/roles.js instead.'
        });
    }
);

module.exports = router;
