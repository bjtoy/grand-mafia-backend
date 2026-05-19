// ============================================
// ready — Bot Startup Event
// ============================================

module.exports = {
    name: 'ready',
    once: true,

    execute(client) {
        try {
            console.log(`✅ Bot logged in as ${client.user.tag}`);
            console.log('🎮 Grand Mafia Bot is ready to serve!');

            // Set bot presence
            client.user.setActivity('The Grand Mafia', {
                type: 0 // PLAYING
            });

        } catch (error) {
            console.error('❌ Ready event error:', error);
        }
    }
};
