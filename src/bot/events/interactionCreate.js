import { EmbedBuilder } from 'discord.js';
import translate from '@vitalets/google-translate-api';

export default {
  name: 'interactionCreate',

  async execute(interaction, client) {
    if (interaction.isButton()) {
      if (!interaction.customId.startsWith('translate_')) return;

      const msg = await interaction.channel.messages.fetch(
        interaction.customId.split('_')[1]
      );

      const lang = interaction.locale?.split('-')[0] || 'en';
      const res = await translate(msg.content, { to: lang });

      const embed = new EmbedBuilder()
        .setTitle(`Translated (${lang})`)
        .setDescription(res.text)
        .setColor('#4CC9FF');

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    await command.execute(interaction, client);
  },
};