// ============================================
// GRAND MAFIA DASHBOARD - SERVER ENTRY POINT
// CLEAN REBUILD (OPTION C)
// ============================================

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import Express app
const app = require('./app');

// Import DB pool for startup checks
const pool = require('./config/db');

// ============================================
// STARTUP CHECKS (AUTO-CREATE MODERATOR ROLE)
// ============================================

async function ensureModeratorRole() {
    try {
        const [rows] = await pool.query(
            'SELECT id FROM roles WHERE name = "Moderator"'
        );

        if (rows.length === 0) {
            await pool.query(
                'INSERT INTO roles (name) VALUES ("Moderator")'
            );
            console.log('✔ Moderator role created automatically');
        } else {
            console.log('✔ Moderator role already exists');
        }
    } catch (error) {
        console.error('Error ensuring Moderator role:', error);
    }
}

// Run the check before server starts
ensureModeratorRole();

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

const server = app.listen(PORT, HOST, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   GRAND MAFIA DASHBOARD - SERVER RUNNING   ║
╚════════════════════════════════════════════╝

📊 Dashboard: http://${HOST}:${PORT}
🔐 Environment: ${process.env.NODE_ENV || 'development'}
⏰ Started: ${new Date().toLocaleString()}
    `);
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

// ============================================
// ERROR HANDLING
// ============================================

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

module.exports = server;
