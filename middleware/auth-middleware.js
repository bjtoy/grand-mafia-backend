// ============================================
// AUTHENTICATION & PERMISSION MIDDLEWARE
// ============================================

const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const pool = require('./config/db'); // MySQL connection

// ============================================
// AUTH MIDDLEWARE (DB-DRIVEN PERMISSIONS)
// ============================================

async function authMiddleware(req, res, next) {
    try {
        let user = null;
        let discordId = null;

        // 1) Session-based auth (if using sessions)
        if (req.session && req.session.user) {
            user = req.session.user;
            discordId = req.session.user.id || req.session.user.discordId;
        } else {
            // 2) JWT-based auth (fallback)
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
            } catch {
                return res.status(401).json({ error: 'Invalid token' });
            }
        }

        if (!discordId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // 3) Load member from DB
        const [members] = await pool.query(
            'SELECT * FROM members WHERE discordId = ?',
            [discordId]
        );

        if (members.length === 0) {
            return res.status(403).json({ error: 'User not registered in members table' });
        }

        const member = members[0];

        // 4) Load roles for this member
        const [roles] = await pool.query(
            `
            SELECT r.*
            FROM roles r
            JOIN member_roles mr ON mr.roleId = r.id
            WHERE mr.memberId = ?
            `,
            [member.id]
        );

        // 5) Build permissions from roles.permissions JSON
        const permissionsSet = new Set();
        const roleNames = [];

        for (const role of roles) {
            roleNames.push(role.name);

            if (role.permissions) {
                try {
                    const perms = JSON.parse(role.permissions);
                    if (Array.isArray(perms)) {
                        perms.forEach(p => permissionsSet.add(p));
                    }
                } catch (e) {
                    console.error('Error parsing role.permissions JSON for role:', role.name, e);
                }
            }
        }

        // 6) Attach enriched user to request
        req.user = {
            ...user,
            discordId,
            dbMember: member,
            roles: roleNames,
            permissions: Array.from(permissionsSet)
        };

        next();
    } catch (error) {
        console.error('authMiddleware error:', error);
        return res.status(500).json({ error: 'Authentication error' });
    }
}

// ============================================
// ROLE / PERMISSION HELPERS
// ============================================

function requirePermission(permission) {
    return (req, res, next) => {
        if (!req.user || !Array.isArray(req.user.permissions)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!req.user.permissions.includes(permission)) {
            return res.status(403).json({ error: 'Forbidden: missing permission ' + permission });
        }

        next();
    };
}

function requireRole(roleName) {
    return (req, res, next) => {
        if (!req.user || !Array.isArray(req.user.roles)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!req.user.roles.includes(roleName)) {
            return res.status(403).json({ error: 'Forbidden: requires role ' + roleName });
        }

        next();
    };
}

function requireAnyRole(roleNames = []) {
    return (req, res, next) => {
        if (!req.user || !Array.isArray(req.user.roles)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

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
// LEGACY ADMIN / MOD MIDDLEWARE (KEPT AS OVERRIDES)
// ============================================

function adminMiddleware(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Admin override via env OR role
    if (
        req.user.discordId === process.env.ADMIN_ID ||
        (Array.isArray(req.user.roles) && req.user.roles.includes('Admin'))
    ) {
        return next();
    }

    return res.status(403).json({ error: 'Forbidden' });
}

function moderatorMiddleware(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const moderatorIds = (process.env.MODERATOR_IDS || '').split(',').filter(Boolean);

    const isEnvModerator = moderatorIds.includes(req.user.discordId);
    const isAdminOverride = req.user.discordId === process.env.ADMIN_ID;
    const hasModRole =
        Array.isArray(req.user.roles) &&
        (req.user.roles.includes('Moderator') || req.user.roles.includes('Admin'));

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
