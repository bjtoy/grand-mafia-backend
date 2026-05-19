// ============================================
// /ping — Backend‑Integrated Command
// Public command
// ============================================

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot latency and Discord API response time'),

    cooldown: 1,

    async execute(interaction) {
        try {
            // Send initial message
            const sent = await interaction.reply({
                content: '🏓 Pinging...',
                fetchReply: true
            });

            // Calculate latencies
            const latency = sent.createdTimestamp - interaction.createdTimestamp;
            const apiLatency = Math.round(interaction.client.ws.ping);

            // Build embed
            const pingEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('🏓 Pong!')
                .addFields(
                    { name: 'Bot Latency', value: `${latency}ms`, inline: true },
                    { name: 'API Latency', value: `${apiLatency}ms`, inline: true }
                )
                .setFooter({ text: 'Grand Mafia Bot' })
                .setTimestamp();

            // Edit original message
            await interaction.editReply({
                content: null,
                embeds: [pingEmbed]
            });

        } catch (error) {
            console.error('❌ Ping command error:', error);

            return interaction.reply({
                content: '❌ Error calculating latency.',
                ephemeral: true
            });
        }
    }
};
