const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Permission middleware
const {
    requireAnyRole,
    requirePermission
} = require('../middleware/auth-middleware');

// ============================================
// MODERATION ROUTES (MOD + ADMIN ONLY)
// ============================================

// WARN MEMBER
router.post(
    '/warn',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('WARN_MEMBERS'),
    async (req, res) => {
        const { memberId, reason } = req.body;

        if (!memberId || !reason) {
            return res.status(400).json({
                success: false,
                message: 'memberId and reason are required'
            });
        }

        try {
            await pool.query(
                `
                INSERT INTO moderation_logs (memberId, action, reason)
                VALUES (?, 'WARN', ?)
                `,
                [memberId, reason]
            );

            res.json({
                success: true,
                message: 'Member warned'
            });

        } catch (error) {
            console.error('Error warning member:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// MUTE MEMBER
router.post(
    '/mute',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('MUTE_MEMBERS'),
    async (req, res) => {
        const { memberId, duration, reason } = req.body;

        if (!memberId || !duration || !reason) {
            return res.status(400).json({
                success: false,
                message: 'memberId, duration, and reason are required'
            });
        }

        try {
            await pool.query(
                `
                INSERT INTO moderation_logs (memberId, action, duration, reason)
                VALUES (?, 'MUTE', ?, ?)
                `,
                [memberId, duration, reason]
            );

            res.json({
                success: true,
                message: 'Member muted'
            });

        } catch (error) {
            console.error('Error muting member:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// DELETE MESSAGE (log only — bot handles actual deletion)
router.post(
    '/delete-message',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('DELETE_MESSAGES'),
    async (req, res) => {
        const { messageId, channelId, reason } = req.body;

        if (!messageId || !channelId) {
            return res.status(400).json({
                success: false,
                message: 'messageId and channelId are required'
            });
        }

        try {
            await pool.query(
                `
                INSERT INTO moderation_logs (action, messageId, channelId, reason)
                VALUES ('DELETE_MESSAGE', ?, ?, ?)
                `,
                [messageId, channelId, reason || null]
            );

            res.json({
                success: true,
                message: 'Message deletion logged'
            });

        } catch (error) {
            console.error('Error logging message deletion:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

// GET MODERATION LOGS (Mod + Admin)
router.get(
    '/logs',
    requireAnyRole(['Admin', 'Mod']),
    requirePermission('VIEW_AUDIT_LOG'),
    async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT *
                FROM moderation_logs
                ORDER BY createdAt DESC
            `);

            res.json({
                success: true,
                logs: rows
            });

        } catch (error) {
            console.error('Error fetching moderation logs:', error);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    }
);

module.exports = router;
