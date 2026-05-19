import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to kick')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for kicking')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  cooldown: 3,
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({
        content: '❌ You do not have permission to kick members!',
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id);

    if (!member) {
      return interaction.reply({
        content: '❌ User not found in this server!',
        ephemeral: true,
      });
    }

    if (!member.kickable) {
      return interaction.reply({
        content: '❌ I cannot kick this user. They may have higher permissions than me.',
        ephemeral: true,
      });
    }

    try {
      await member.kick(reason);

      const kickEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('👢 User Kicked')
        .addFields(
          { name: 'User', value: `${user.tag}`, inline: true },
          { name: 'Reason', value: reason, inline: true },
          { name: 'Moderator', value: interaction.user.tag, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [kickEmbed] });
    } catch (error) {
      console.error('Kick error:', error);
      await interaction.reply({
        content: '❌ Error kicking user!',
        ephemeral: true,
      });
    }
  },
};
