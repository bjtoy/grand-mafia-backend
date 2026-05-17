const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // MySQL connection

// Auth + Permission middleware
const {
    authMiddleware,
    requirePermission,
    requireRole,
    requireAnyRole,
    limiter
} = require('./auth-middleware');

const app = express();

// ============================================
// GLOBAL MIDDLEWARE
// ============================================

app.use(express.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
);

// Global rate limiting
app.use(limiter);

// ============================================
// PUBLIC ROUTES (NO AUTH REQUIRED)
// ============================================

app.get('/api/test', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT "Backend is connected!" AS message'
        );
        res.json({ success: true, message: rows[0].message });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// ============================================
// PROTECTED ROUTES (AUTH REQUIRED)
// ============================================

// Attach auth middleware BEFORE protected routes
app.use(authMiddleware);

// USERS (Admin only)
app.use(
    '/api/users',
    requireRole('Admin'),
    requirePermission('MANAGE_USERS'),
    require('./routes/users')
);

// MEMBERS (Moderator or Admin)
app.use(
    '/api/members',
    requireAnyRole(['Admin', 'Moderator']),
    requirePermission('MANAGE_MEMBERS'),
    require('./routes/members')
);

// GUIDES (Moderator/Admin for now — we can split read/write later)
app.use(
    '/api/guides',
    requireAnyRole(['Admin', 'Moderator']),
    requirePermission('MANAGE_GUIDES'),
    require('./routes/guides')
);

// ROLES (Admin + Moderator) — UPDATED AS REQUESTED
app.use(
    '/api/roles',
    requireAnyRole(['Admin', 'Moderator']),
    requirePermission('MANAGE_ROLES'),
    require('./routes/roles')
);

// ANNOUNCEMENTS (Moderator/Admin)
app.use(
    '/api/announcements',
    requireAnyRole(['Admin', 'Moderator']),
    requirePermission('MANAGE_ANNOUNCEMENTS'),
    require('./routes/announcements')
);

// MODERATION (Moderator/Admin)
app.use(
    '/api/moderation',
    requireAnyRole(['Admin', 'Moderator']),
    requirePermission('MANAGE_MODERATION'),
    require('./routes/moderation')
);

// SETTINGS (Admin only)
app.use(
    '/api/settings',
    requireRole('Admin'),
    requirePermission('MANAGE_SETTINGS'),
    require('./routes/settings')
);

// GUIDE VERSIONS (Moderator/Admin)
app.use(
    '/api/guide_versions',
    requireAnyRole(['Admin', 'Moderator']),
    requirePermission('MANAGE_GUIDES'),
    require('./routes/guide_versions')
);

// MEMBER ROLES (Admin + Moderator)
app.use(
    '/api/member_roles',
    requireAnyRole(['Admin', 'Moderator']),
    requirePermission('MANAGE_ROLES'),
    require('./routes/member_roles')
);

// ============================================
// EXPORT APP
// ============================================

module.exports = app;
