const { EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');

module.exports = {
    name: 'interactionCreate',

    async execute(client, interaction) {
        try {
            // ============================================
            // BUTTON HANDLER (TRANSLATION)
            // ============================================
            if (interaction.isButton()) {
                if (!interaction.customId.startsWith('translate_')) return;

                const messageId = interaction.customId.split('_')[1];

                const originalMessage = await interaction.channel.messages
                    .fetch(messageId)
                    .catch(() => null);

                if (!originalMessage) {
                    return interaction.reply({
                        content: '❌ Could not find the original message.',
                        flags: 64
                    });
                }

                const lang = interaction.locale?.split('-')[0] || 'en';

                let translated;
                try {
                    translated = await translate(originalMessage.content, { to: lang });
                } catch (err) {
                    console.error('❌ Translation error:', err);
                    return interaction.reply({
                        content: `❌ Could not translate this message to **${lang}**.`,
                        flags: 64
                    });
                }

                const embed = new EmbedBuilder()
                    .setColor('#4CC9FF')
                    .setTitle(`🌐 Translated (${lang.toUpperCase()})`)
                    .addFields(
                        { name: 'Original', value: originalMessage.content || '*(no text)*' },
                        { name: 'Translation', value: translated.text || '*(no translation)*' }
                    )
                    .setFooter({ text: 'Powered by Google Translate (Unofficial API)' })
                    .setTimestamp();

                return interaction.reply({
                    embeds: [embed],
                    flags: 64
                });
            }

            // ============================================
            // SLASH COMMAND HANDLER
            // ============================================
            if (interaction.isChatInputCommand()) {
                const command = client.commands.get(interaction.commandName);
                if (!command) return;

                try {
                    await command.execute(interaction);
                } catch (err) {
                    console.error('❌ Command execution error:', err);

                    if (!interaction.replied && !interaction.deferred) {
                        await interaction.reply({
                            content: '❌ An unexpected error occurred.',
                            flags: 64
                        });
                    }
                }
            }

        } catch (error) {
            console.error('❌ interactionCreate error:', error);

            if (!interaction.replied && !interaction.deferred) {
                return interaction.reply({
                    content: '❌ An unexpected error occurred.',
                    flags: 64
                });
            }
        }
    }
};
