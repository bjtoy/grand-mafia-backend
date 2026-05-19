import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Post an announcement to the server (Moderators only)')
    .addStringOption(option =>
      option
        .setName('title')
        .setDescription('Announcement title')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Announcement message')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('channel')
        .setDescription('Channel ID to post announcement (optional)')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  cooldown: 5,
  async execute(interaction) {
    // Check if user has manage messages permission
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: '❌ You do not have permission to use this command. Moderators only!',
        ephemeral: true,
      });
    }

    const title = interaction.options.getString('title');
    const message = interaction.options.getString('message');
    const channelId = interaction.options.getString('channel');

    try {
      let targetChannel = interaction.channel;

      if (channelId) {
        targetChannel = await interaction.guild.channels.fetch(channelId);
        if (!targetChannel) {
          return interaction.reply({
            content: '❌ Channel not found!',
            ephemeral: true,
          });
        }
      }

      const announcementEmbed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle(`📢 ${title}`)
        .setDescription(message)
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setFooter({ text: 'Grand Mafia Faction' })
        .setTimestamp();

      await targetChannel.send({ embeds: [announcementEmbed] });

      const confirmEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('✅ Announcement Posted')
        .setDescription(`Your announcement has been posted to ${targetChannel}`)
        .setTimestamp();

      await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
    } catch (error) {
      console.error('Announcement error:', error);
      await interaction.reply({
        content: '❌ Error posting announcement!',
        ephemeral: true,
      });
    }
  },
};
