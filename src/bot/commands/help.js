import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display all available bot commands'),
  cooldown: 2,
  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📚 Grand Mafia Bot - Command Help')
      .setDescription('Here are all the available commands for managing your faction server.')
      .addFields(
        {
          name: '🌐 Translation Commands',
          value: '`/translate` - Translate text to any language',
          inline: false,
        },
        {
          name: '📢 Announcement Commands',
          value: '`/announce` - Post an announcement to the server (Moderators only)',
          inline: false,
        },
        {
          name: '⚔️ Moderation Commands',
          value:
            '`/kick` - Kick a user from the server\n' +
            '`/ban` - Ban a user from the server\n' +
            '`/mute` - Mute a user temporarily\n' +
            '`/warn` - Issue a warning to a user',
          inline: false,
        },
        {
          name: '❓ Other Commands',
          value: '`/help` - Display this help message\n`/ping` - Check bot latency\n`/serverinfo` - Get server information',
          inline: false,
        }
      )
      .addFields(
        {
          name: '💡 Tips',
          value:
            '• Use `/translate text:hello language:es` to translate\n' +
            '• Moderation commands require appropriate permissions\n' +
            '• All commands support autocomplete where applicable',
          inline: false,
        }
      )
      .setFooter({ text: 'Grand Mafia Faction Server' })
      .setTimestamp();

    await interaction.reply({ embeds: [helpEmbed] });
  },
};
