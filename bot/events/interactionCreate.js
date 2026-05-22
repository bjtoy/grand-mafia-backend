// ============================================
// interactionCreate — Handles Buttons + Commands
// ============================================

const { EmbedBuilder } = require('discord.js');
const translate = require('@vitalets/google-translate-api');

module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client, pool) {
        try {
            // ============================================
            // BUTTON INTERACTIONS
            // ============================================
            if (interaction.isButton()) {
                if (!interaction.customId.startsWith('translate_')) return;

                const messageId = interaction.customId.split('_')[1];

                // Fetch original message
                const originalMessage = await interaction.channel.messages
                    .fetch(messageId)
                    .catch(() => null);

                if (!originalMessage) {
                    return interaction.reply({
                        content: '❌ Could not find the original message.',
                        ephemeral: true
                    });
                }

                // Determine target language
                const lang = interaction.locale?.split('-')[0] || 'en';

                // Perform translation
                let translated;
                try {
                    translated = await translate(originalMessage.content, { to: lang });
                } catch (err) {
                    console.error('❌ Translation error:', err);

                    return interaction.reply({
                        content: `❌ Could not translate this message to **${lang}**.`,
                        ephemeral: true
                    });
                }

                // Build translation embed
                const embed = new EmbedBuilder()
                    .setColor('#4CC9FF')
                    .setTitle(`🌐 Translated (${lang.toUpperCase()})`)
                    .addFields(
                        { name: 'Original', value: originalMessage.content },
                        { name: 'Translation', value: translated.text }
                    )
                    .setFooter({ text: 'Powered by Google Translate (Unofficial API)' })
                    .setTimestamp();

                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
            }

            // ============================================
            // SLASH COMMANDS
            // ============================================
            if (!interaction.isChatInputCommand()) return;

            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            await command.execute(interaction, pool);

        } catch (error) {
            console.error('❌ interactionCreate error:', error);

            if (!interaction.replied && !interaction.deferred) {
                return interaction.reply({
                    content: '❌ An unexpected error occurred.',
                    ephemeral: true
                });
            }
        }
    }
};
