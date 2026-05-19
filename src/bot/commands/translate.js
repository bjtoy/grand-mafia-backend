import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import translate from '@vitalets/google-translate-api';

export default {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate text to a specified language')
    .addStringOption(option =>
      option
        .setName('text')
        .setDescription('The text to translate')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('language')
        .setDescription('Target language (e.g., en, es, fr, de, ja, zh, ru, ar, etc.)')
        .setRequired(true)
    ),
  cooldown: 2,

  async execute(interaction) {
    await interaction.deferReply();

    const text = interaction.options.getString('text');
    const targetLanguage = interaction.options.getString('language').toLowerCase();

    try {
      const result = await translate(text, { to: targetLanguage });

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🌐 Translation')
        .addFields(
          { name: 'Original Text', value: text, inline: false },
          { name: `Translated to ${targetLanguage.toUpperCase()}`, value: result.text, inline: false },
          { name: 'Detected Language', value: result.from.language.iso.toUpperCase(), inline: true }
        )
        .setFooter({ text: 'Powered by Google Translate (Unofficial API)' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Translation error:', error);

      const errorEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('❌ Translation Error')
        .setDescription(`Could not translate to language code: \`${targetLanguage}\``)
        .addFields(
          { name: 'Tip', value: 'Use standard language codes like: en, es, fr, de, ja, zh, ru, ar, pt, it, ko' }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
