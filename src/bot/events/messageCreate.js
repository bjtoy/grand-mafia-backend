import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
  name: 'messageCreate',
  async execute(message) {
    // Ignore bot messages
    if (message.author.bot) return;

    // Create the translate button
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
  }
};
