const express = require('express');
const router = express.Router();
const prisma = require('../config/db');

const {
    requireAnyRole,
    requirePermission
} = require('../middleware/auth-middleware');

// ============================================
// PUBLIC / READ-ONLY ROUTES
// ============================================

// GET ALL MEMBERS (public)
router.get('/', async (req, res) => {
    try {
        const members = await prisma.member.findMany({
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            members
        });

    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET MEMBER BY ID (public)
router.get('/:id', async (req, res) => {
    try {
        const member = await prisma.member.findUnique({
            where: { id: req.params.id }
        });

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        res.json({
            success: true,
            member
        });

    } catch (error) {
        console.error('Error fetching member:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// ============================================
// PROTECTED ROUTES (DISABLED)
// ============================================

router.post(
    '/',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('MANAGE_MEMBERS'),
    (req, res) => {
        return res.status(403).json({
            success: false,
            message: 'Members cannot be created manually. They are created automatically.'
        });
    }
);

router.put(
    '/:id',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('MANAGE_MEMBERS'),
    (req, res) => {
        return res.status(403).json({
            success: false,
            message: 'Members cannot be updated manually. They are synced automatically.'
        });
    }
);

router.delete(
    '/:id',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('MANAGE_MEMBERS'),
    (req, res) => {
        return res.status(403).json({
            success: false,
            message: 'Members cannot be deleted manually.'
        });
    }
);

module.exports = router;
