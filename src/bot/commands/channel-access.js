import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('channel-access')
    .setDescription('Manage channel access by role')
    .addSubcommand(subcommand =>
      subcommand
        .setName('allow-role')
        .setDescription('Allow a role to access a channel')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Channel to manage')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role to allow')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('deny-role')
        .setDescription('Deny a role access to a channel')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Channel to manage')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role to deny')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('view-permissions')
        .setDescription('View channel permissions')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Channel to check')
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  cooldown: 3,
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({
        content: '❌ You do not have permission to manage channels!',
        ephemeral: true,
      });
    }

    const subcommand = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel('channel');

    if (subcommand === 'allow-role') {
      const role = interaction.options.getRole('role');

      try {
        await channel.permissionOverwrites.create(role, {
          ViewChannel: true,
          SendMessages: true,
          ReadMessageHistory: true,
        });

        const allowEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('✅ Role Access Allowed')
          .addFields(
            { name: 'Channel', value: channel.name, inline: true },
            { name: 'Role', value: role.name, inline: true },
            { name: 'Permissions', value: 'View, Send, Read History', inline: false }
          )
          .setTimestamp();

        await interaction.reply({ embeds: [allowEmbed] });
      } catch (error) {
        console.error('Channel access error:', error);
        await interaction.reply({
          content: '❌ Error setting channel permissions!',
          ephemeral: true,
        });
      }
    } else if (subcommand === 'deny-role') {
      const role = interaction.options.getRole('role');

      try {
        await channel.permissionOverwrites.create(role, {
          ViewChannel: false,
          SendMessages: false,
        });

        const denyEmbed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('✅ Role Access Denied')
          .addFields(
            { name: 'Channel', value: channel.name, inline: true },
            { name: 'Role', value: role.name, inline: true },
            { name: 'Permissions', value: 'No access', inline: false }
          )
          .setTimestamp();

        await interaction.reply({ embeds: [denyEmbed] });
      } catch (error) {
        console.error('Channel access error:', error);
        await interaction.reply({
          content: '❌ Error setting channel permissions!',
          ephemeral: true,
        });
      }
    } else if (subcommand === 'view-permissions') {
      const permissions = channel.permissionOverwrites.cache;

      if (permissions.size === 0) {
        return interaction.reply({
          content: `✅ #${channel.name} has default permissions (no overrides)`,
          ephemeral: true,
        });
      }

      const permissionsList = permissions
        .map(perm => {
          const target = perm.type === 'role' ? `<@&${perm.id}>` : `<@${perm.id}>`;
          const allow = perm.allow.toArray().join(', ') || 'None';
          const deny = perm.deny.toArray().join(', ') || 'None';
          return `${target}\n  ✅ Allow: ${allow}\n  ❌ Deny: ${deny}`;
        })
        .join('\n\n');

      const viewEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`🔐 #${channel.name} - Permissions`)
        .setDescription(permissionsList)
        .setFooter({ text: 'Grand Mafia - Channel Access' })
        .setTimestamp();

      await interaction.reply({ embeds: [viewEmbed] });
    }
  },
};
