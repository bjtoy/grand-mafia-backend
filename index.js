require('dotenv').config();

const app = require('./app');
const { ensureRolesExist } = require('./roleSync');
const bot = require('./bot'); // <-- IMPORTANT: bot is now loaded

const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        console.log('🔄 Initializing backend...');

        // Ensure internal roles exist in DB
        await ensureRolesExist();
        console.log('✔ Roles synced with database');

        // Start Express server
        app.listen(PORT, () => {
            console.log(`🚀 Backend running on port ${PORT}`);
        });

    } catch (error) {
        console.error('❌ Failed to start backend:', error);
        process.exit(1);
    }
}

startServer();
