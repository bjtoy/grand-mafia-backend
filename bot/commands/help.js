// ============================================
// /help — Backend‑Integrated Command
// Public command
// ============================================

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display all available bot commands'),

    cooldown: 2,

    async execute(interaction) {
        try {
            // Defer immediately to avoid "Unknown interaction"
            await interaction.deferReply({ flags: 64 }); // ephemeral

            const helpEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('📚 Grand Mafia Bot — Command Help')
                .setDescription('Here are the available commands for managing your faction server.')
                .addFields(
                    {
                        name: '🌐 Translation Commands',
                        value: '`/translate` — Translate text to any language'
                    },
                    {
                        name: '📢 Announcement Commands',
                        value: '`/announce` — Post an announcement (Admin/Mod)'
                    },
                    {
                        name: '📖 Guide Commands',
                        value:
                            '`/guide` — Create, post, and list guides (Admin/Mod)\n' +
                            '`/guide-styled` — Post a styled training guide (Admin/Mod)'
                    },
                    {
                        name: '⚔️ Moderation Commands',
                        value:
                            '`/kick` — Kick a user\n' +
                            '`/ban` — Ban a user\n' +
                            '`/mute` — Mute a user\n' +
                            '`/warn` — Issue a warning'
                    },
                    {
                        name: '🔐 Channel Management',
                        value: '`/channel-access` — Allow/Deny role access to channels'
                    },
                    {
                        name: '❓ Other Commands',
                        value:
                            '`/help` — Display this help message\n' +
                            '`/ping` — Check bot latency\n' +
                            '`/serverinfo` — Get server information'
                    },
                    {
                        name: '💡 Tips',
                        value:
                            '• Use `/translate text:hello language:es`\n' +
                            '• Moderation commands require Admin/Mod roles\n' +
                            '• All commands support autocomplete where applicable'
                    }
                )
                .setFooter({ text: 'Grand Mafia Faction Server' })
                .setTimestamp();

            // Edit the deferred reply
            await interaction.editReply({ embeds: [helpEmbed] });

        } catch (error) {
            console.error('❌ Help command error:', error);

            // Only reply if not already replied/deferred
            if (!interaction.replied && !interaction.deferred) {
                return interaction.reply({
                    content: '❌ Unexpected error while generating help menu.',
                    flags: 64
                });
            }
        }
    }
};
