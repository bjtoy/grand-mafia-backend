import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Display information about the server'),
  cooldown: 2,
  async execute(interaction) {
    const guild = interaction.guild;
    const owner = await guild.fetchOwner();

    const serverinfoEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`📊 ${guild.name} - Server Information`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: 'Server ID', value: guild.id, inline: true },
        { name: 'Owner', value: owner.user.tag, inline: true },
        { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: false },
        { name: 'Members', value: `${guild.memberCount}`, inline: true },
        { name: 'Channels', value: `${guild.channels.cache.size}`, inline: true },
        { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
        { name: 'Verification Level', value: guild.verificationLevel.toString(), inline: true },
        { name: 'Boost Level', value: `${guild.premiumTier}`, inline: true },
        { name: 'Boosts', value: `${guild.premiumSubscriptionCount}`, inline: true }
      )
      .setFooter({ text: 'Grand Mafia Faction Server' })
      .setTimestamp();

    await interaction.reply({ embeds: [serverinfoEmbed] });
  },
};
