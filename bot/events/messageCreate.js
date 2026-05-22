// ============================================
// messageCreate — Add Translate Button Under Messages
// ============================================

const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

module.exports = {
    name: 'messageCreate',

    async execute(message) {
        try {
            // Ignore bot messages
            if (message.author.bot) return;

            // Prevent loops (don't add buttons to bot replies)
            if (message.reference) {
                const replied = await message.fetchReference().catch(() => null);
                if (replied && replied.author.bot) return;
            }

            // Create translate button
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`translate_${message.id}`)
                    .setLabel('🌐 Translate')
                    .setStyle(ButtonStyle.Primary)
            );

            // Send the button under the message
            await message.reply({
                content: 'Tap to translate this message',
                components: [row],
                allowedMentions: { repliedUser: false }
            });

        } catch (error) {
            console.error('❌ messageCreate error:', error);
        }
    }
};
