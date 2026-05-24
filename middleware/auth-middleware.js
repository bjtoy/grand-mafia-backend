// ============================================
// AUTHENTICATION & PERMISSION MIDDLEWARE
// BACKEND-ONLY VERSION (NO DISCORD CLIENT REQUIRED)
// ============================================

const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const prisma = require('../config/db');

// Internal roles + permissions
const INTERNAL_ROLES = require('../config/roles');

// Role Sync Engine (backend only)
const {
    syncMemberRoles,
    mapDiscordRolesToInternal
} = require('../services/roleSync.js');

// ============================================
// AUTH MIDDLEWARE (JWT + INTERNAL ROLES)
// ============================================

async function authMiddleware(req, res, next) {
    try {
        let user = null;
        let discordId = null;
        let discordRoles = [];

        // --------------------------------------------
        // 1) SESSION AUTH
        // --------------------------------------------
        if (req.session && req.session.user) {
            user = req.session.user;
            discordId = user.id || user.discordId;
            discordRoles = user.roles || [];
        }

        // --------------------------------------------
        // 2) JWT AUTH (fallback)
        // --------------------------------------------
        else {
            const token =
                req.cookies?.token ||
                (req.headers.authorization && req.headers.authorization.split(' ')[1]);

            if (!token) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            try {
                const decoded = jwt.verify(
                    token,
                    process.env.JWT_SECRET || 'your-secret-key'
                );

                user = decoded;
                discordId = decoded.id || decoded.discordId;
                discordRoles = decoded.roles || [];

            } catch {
                return res.status(401).json({ error: 'Invalid token' });
            }
        }

        if (!discordId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // --------------------------------------------
        // 3) SYNC ROLES WITH DATABASE
        // --------------------------------------------
        const internalRoles = await syncMemberRoles(discordId, discordRoles);

        // --------------------------------------------
        // 4) BUILD PERMISSIONS FROM INTERNAL ROLES
        // --------------------------------------------
        const permissionsSet = new Set();

        for (const roleName of internalRoles) {
            const roleConfig = INTERNAL_ROLES[roleName];

            if (!roleConfig) continue;

            const perms = roleConfig.permissions;

            if (perms.includes('*')) {
                permissionsSet.add('*');
            } else {
                perms.forEach(p => permissionsSet.add(p));
            }
        }

        // --------------------------------------------
        // 5) LOAD MEMBER FROM DB (Prisma)
        // --------------------------------------------
        const member = await prisma.member.findUnique({
            where: { discordId }
        });

        if (!member) {
            return res.status(403).json({ error: 'User not registered in members table' });
        }

        // --------------------------------------------
        // 6) ATTACH USER TO REQUEST
        // --------------------------------------------
        req.user = {
            ...user,
            discordId,
            dbMember: member,
            roles: internalRoles,
            permissions: Array.from(permissionsSet)
        };

        next();

    } catch (error) {
        console.error('authMiddleware error:', error);
        return res.status(500).json({ error: 'Authentication error' });
    }
}

// ============================================
// PERMISSION HELPERS
// ============================================

function requirePermission(permission) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

        if (
            !req.user.permissions.includes('*') &&
            !req.user.permissions.includes(permission)
        ) {
            return res.status(403).json({
                error: 'Forbidden: missing permission ' + permission
            });
        }

        next();
    };
}

function requireRole(roleName) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

        if (!req.user.roles.includes(roleName)) {
            return res.status(403).json({
                error: 'Forbidden: requires role ' + roleName
            });
        }

        next();
    };
}

function requireAnyRole(roleNames = []) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

        const hasRole = roleNames.some(r => req.user.roles.includes(r));

        if (!hasRole) {
            return res.status(403).json({
                error: 'Forbidden: requires one of roles ' + roleNames.join(', ')
            });
        }

        next();
    };
}

// ============================================
// LEGACY OVERRIDES (Admin / Moderator)
// ============================================

function adminMiddleware(req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    if (
        req.user.discordId === process.env.ADMIN_ID ||
        req.user.roles.includes('Admin')
    ) {
        return next();
    }

    return res.status(403).json({ error: 'Forbidden' });
}

function moderatorMiddleware(req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const moderatorIds = (process.env.MODERATOR_IDS || '').split(',').filter(Boolean);

    const isEnvModerator = moderatorIds.includes(req.user.discordId);
    const isAdminOverride = req.user.discordId === process.env.ADMIN_ID;
    const hasModRole =
        req.user.roles.includes('Moderator') ||
        req.user.roles.includes('Admin');

    if (isEnvModerator || isAdminOverride || hasModRole) {
        return next();
    }

    return res.status(403).json({ error: 'Forbidden' });
}

// ============================================
// RATE LIMITERS
// ============================================

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later.'
});

// ============================================
// EXPORT
// ============================================

module.exports = {
    authMiddleware,
    adminMiddleware,
    moderatorMiddleware,
    requirePermission,
    requireRole,
    requireAnyRole,
    limiter,
    authLimiter
};
