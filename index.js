// ============================================
// BACKEND ENTRY POINT (SECTION D REBUILD)
// ============================================

require('dotenv').config();

const app = require('./app');
const { ensureRolesExist } = require('./roleSync');

// Optional: If your bot is connected here, import it
// const bot = require('./bot'); // Uncomment if needed

const PORT = process.env.PORT || 3001;

// ============================================
// START SERVER
// ============================================

async function startServer() {
    try {
        console.log('🔄 Initializing backend...');

        // Ensure internal roles exist in DB
        await ensureRolesExist();
        console.log('✔ Roles synced with database');

        // OPTIONAL: Sync all Discord members on startup
        // if (bot && bot.guilds.cache.size > 0) {
        //     const guild = bot.guilds.cache.get(process.env.GUILD_ID);
        //     if (guild) {
        //         const members = await guild.members.fetch();
        //         await syncAllMembers(members);
        //         console.log('✔ Full member sync completed');
        //     }
        // }

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
