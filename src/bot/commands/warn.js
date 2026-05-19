import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to warn')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for warning')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  cooldown: 2,
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: '❌ You do not have permission to warn members!',
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    try {
      // Send DM to the warned user
      const warnDM = new EmbedBuilder()
        .setColor('#ff6600')
        .setTitle('⚠️ You Have Been Warned')
        .setDescription(`You received a warning in **${interaction.guild.name}**`)
        .addFields(
          { name: 'Reason', value: reason, inline: false },
          { name: 'Moderator', value: interaction.user.tag, inline: true }
        )
        .setTimestamp();

      try {
        await user.send({ embeds: [warnDM] });
      } catch (dmError) {
        console.log(`Could not send DM to ${user.tag}`);
      }

      // Send confirmation in channel
      const warnEmbed = new EmbedBuilder()
        .setColor('#ff6600')
        .setTitle('⚠️ User Warned')
        .addFields(
          { name: 'User', value: `${user.tag}`, inline: true },
          { name: 'Reason', value: reason, inline: false },
          { name: 'Moderator', value: interaction.user.tag, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [warnEmbed] });
    } catch (error) {
      console.error('Warn error:', error);
      await interaction.reply({
        content: '❌ Error warning user!',
        ephemeral: true,
      });
    }
  },
};
