// ============================================
// GLOBAL ERROR HANDLER
// ============================================

// Custom error class (optional but useful)
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

// ============================================
// MAIN ERROR HANDLER MIDDLEWARE
// ============================================

function errorHandler(err, req, res, next) {
    const status = err.statusCode || 500;

    console.error({
        timestamp: new Date(),
        message: err.message,
        statusCode: status,
        path: req.path,
        method: req.method
    });

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation error' });
    }

    // Default response
    res.status(status).json({
        success: false,
        error: err.message || 'Internal server error'
    });
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
    AppError,
    errorHandler
};
