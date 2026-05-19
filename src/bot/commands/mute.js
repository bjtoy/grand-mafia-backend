import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a user temporarily')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to mute')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('duration')
        .setDescription('Duration in seconds (default: 300 = 5 minutes)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for muting')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  cooldown: 3,
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({
        content: '❌ You do not have permission to mute members!',
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration') || 300; // 5 minutes default
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id);

    if (!member) {
      return interaction.reply({
        content: '❌ User not found in this server!',
        ephemeral: true,
      });
    }

    try {
      await member.timeout(duration * 1000, reason);

      const muteEmbed = new EmbedBuilder()
        .setColor('#ffa500')
        .setTitle('🔇 User Muted')
        .addFields(
          { name: 'User', value: `${user.tag}`, inline: true },
          { name: 'Duration', value: `${duration} seconds`, inline: true },
          { name: 'Reason', value: reason, inline: false },
          { name: 'Moderator', value: interaction.user.tag, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [muteEmbed] });
    } catch (error) {
      console.error('Mute error:', error);
      await interaction.reply({
        content: '❌ Error muting user!',
        ephemeral: true,
      });
    }
  },
};
