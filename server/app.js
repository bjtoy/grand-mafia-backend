// ============================================
// GRAND MAFIA DASHBOARD - EXPRESS SERVER
// CLEAN REBUILD (OPTION C)
// ============================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const dashboardRoutes = require('./routes/dashboard');

// Import middleware
const { authMiddleware } = require('./middleware/auth-middleware');
const { errorHandler } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Security
app.use(helmet());

// CORS
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true
    })
);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Sessions
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    })
);

// Static frontend files
app.use(express.static(path.join(__dirname, '../web')));

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api', authMiddleware, apiRoutes);

// Serve dashboard frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../web/index.html'));
});

// SPA fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../web/index.html'));
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use(errorHandler);

// ============================================
// EXPORT
// ============================================

module.exports = app;
