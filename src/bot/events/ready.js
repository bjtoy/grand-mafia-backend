export default {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot logged in as ${client.user.tag}`);
    console.log(`🎮 Grand Mafia Bot is ready to serve!`);
    
    // Set bot status
    client.user.setActivity('The Grand Mafia', { type: 'PLAYING' });
  },
};
