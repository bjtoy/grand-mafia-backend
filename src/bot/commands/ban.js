import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to ban')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for banning')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  cooldown: 3,
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: '❌ You do not have permission to ban members!',
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      await interaction.guild.members.ban(user, { reason });

      const banEmbed = new EmbedBuilder()
        .setColor('#8b0000')
        .setTitle('🚫 User Banned')
        .addFields(
          { name: 'User', value: `${user.tag}`, inline: true },
          { name: 'Reason', value: reason, inline: true },
          { name: 'Moderator', value: interaction.user.tag, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [banEmbed] });
    } catch (error) {
      console.error('Ban error:', error);
      await interaction.reply({
        content: '❌ Error banning user!',
        ephemeral: true,
      });
    }
  },
};
