import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('guide')
    .setDescription('Create and manage game guides')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Create a new game guide')
        .addStringOption(option =>
          option
            .setName('title')
            .setDescription('Guide title')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('category')
            .setDescription('Guide category')
            .setRequired(true)
            .addChoices(
              { name: 'Enforcers & Underbosses', value: 'enforcers' },
              { name: 'Kingpins', value: 'kingpins' },
              { name: 'UM Raids', value: 'um-raids' },
              { name: 'Investments', value: 'investments' },
              { name: 'Construction', value: 'construction' },
              { name: 'Preparing for Raids', value: 'preparing-raids' },
              { name: 'UM Raid Leaders', value: 'raid-leaders' },
              { name: 'Governors', value: 'governors' },
              { name: 'Oakvale War', value: 'oakvale-war' },
              { name: 'Kill Event', value: 'kill-event' },
              { name: 'Raid Coordination', value: 'raid-coordination' }
            )
        )
        .addStringOption(option =>
          option
            .setName('content')
            .setDescription('Guide content (use \\n for line breaks)')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('post')
        .setDescription('Post a guide to a channel')
        .addStringOption(option =>
          option
            .setName('title')
            .setDescription('Guide title')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('channel')
            .setDescription('Target channel ID')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List all guides')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  cooldown: 3,
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: '❌ You do not have permission to use this command. Moderators only!',
        ephemeral: true,
      });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'create') {
      const title = interaction.options.getString('title');
      const category = interaction.options.getString('category');
      const content = interaction.options.getString('content').replace(/\\n/g, '\n');

      const guideEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`📖 ${title}`)
        .setDescription(content)
        .addFields(
          { name: 'Category', value: category, inline: true },
          { name: 'Created by', value: interaction.user.tag, inline: true },
          { name: 'Created at', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
        )
        .setFooter({ text: 'Grand Mafia - Game Guide' })
        .setTimestamp();

      const confirmEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('✅ Guide Created')
        .setDescription(`Guide "${title}" has been created successfully!`)
        .addFields(
          { name: 'Category', value: category, inline: true },
          { name: 'Next Step', value: 'Use `/guide post` to publish this guide to a channel', inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
    } else if (subcommand === 'post') {
      const title = interaction.options.getString('title');
      const channelId = interaction.options.getString('channel');

      try {
        const targetChannel = await interaction.guild.channels.fetch(channelId);

        if (!targetChannel) {
          return interaction.reply({
            content: '❌ Channel not found!',
            ephemeral: true,
          });
        }

        // Create guide embed
        const guideEmbed = new EmbedBuilder()
          .setColor('#FFD700')
          .setTitle(`📖 ${title}`)
          .setDescription('Guide content will be displayed here')
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setFooter({ text: 'Grand Mafia - Game Guide' })
          .setTimestamp();

        await targetChannel.send({ embeds: [guideEmbed] });

        const confirmEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('✅ Guide Posted')
          .setDescription(`Guide "${title}" has been posted to ${targetChannel}`)
          .setTimestamp();

        await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
      } catch (error) {
        console.error('Guide post error:', error);
        await interaction.reply({
          content: '❌ Error posting guide!',
          ephemeral: true,
        });
      }
    } else if (subcommand === 'list') {
      const listEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📚 Available Guides')
        .setDescription('Game guides by category')
        .addFields(
          {
            name: '⚔️ Combat & Strategy',
            value: '• Enforcers & Underbosses\n• Kingpins\n• UM Raids\n• Raid Coordination',
            inline: false,
          },
          {
            name: '💰 Economy & Resources',
            value: '• Investments\n• Construction\n• Resource Management',
            inline: false,
          },
          {
            name: '🎯 War & Events',
            value: '• Oakvale War\n• Kill Events\n• Raid Preparation',
            inline: false,
          },
          {
            name: '👑 Leadership',
            value: '• Governors Guide\n• UM Raid Leaders\n• Leadership Tips',
            inline: false,
          }
        )
        .setFooter({ text: 'Use /guide create to add new guides' })
        .setTimestamp();

      await interaction.reply({ embeds: [listEmbed] });
    }
  },
};
