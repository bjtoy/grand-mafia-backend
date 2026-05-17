// ============================================
// AUTHENTICATION & PERMISSION MIDDLEWARE
// ============================================

const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// ============================================
// AUTH MIDDLEWARE
// ============================================

function authMiddleware(req, res, next) {
    // Check session login
    if (req.session && req.session.user) {
        return next();
    }

    // Check JWT token
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// ============================================
// ADMIN MIDDLEWARE
// ============================================

function adminMiddleware(req, res, next) {
    if (!req.session?.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.session.user.id === process.env.ADMIN_ID) {
        return next();
    }

    return res.status(403).json({ error: 'Forbidden' });
}

// ============================================
// MODERATOR MIDDLEWARE
// ============================================

function moderatorMiddleware(req, res, next) {
    if (!req.session?.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const moderatorIds = (process.env.MODERATOR_IDS || '').split(',');

    if (
        moderatorIds.includes(req.session.user.id) ||
        req.session.user.id === process.env.ADMIN_ID
    ) {
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
    limiter,
    authLimiter
};
