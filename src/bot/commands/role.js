import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Manage member roles and permissions')
    .addSubcommand(subcommand =>
      subcommand
        .setName('assign')
        .setDescription('Assign a role to a member')
        .addUserOption(option =>
          option
            .setName('member')
            .setDescription('Member to assign role to')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role to assign')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('reason')
            .setDescription('Reason for assignment')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a role from a member')
        .addUserOption(option =>
          option
            .setName('member')
            .setDescription('Member to remove role from')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role to remove')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('reason')
            .setDescription('Reason for removal')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List all roles and their members')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('member-roles')
        .setDescription('View all roles for a specific member')
        .addUserOption(option =>
          option
            .setName('member')
            .setDescription('Member to check')
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  cooldown: 3,
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({
        content: '❌ You do not have permission to manage roles!',
        ephemeral: true,
      });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'assign') {
      const member = interaction.options.getUser('member');
      const role = interaction.options.getRole('role');
      const reason = interaction.options.getString('reason') || 'No reason provided';

      try {
        const guildMember = await interaction.guild.members.fetch(member.id);

        if (guildMember.roles.cache.has(role.id)) {
          return interaction.reply({
            content: `❌ ${member.tag} already has the ${role.name} role!`,
            ephemeral: true,
          });
        }

        await guildMember.roles.add(role);

        const assignEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('✅ Role Assigned')
          .addFields(
            { name: 'Member', value: member.tag, inline: true },
            { name: 'Role', value: role.name, inline: true },
            { name: 'Reason', value: reason, inline: false },
            { name: 'Assigned by', value: interaction.user.tag, inline: true }
          )
          .setTimestamp();

        await interaction.reply({ embeds: [assignEmbed] });
      } catch (error) {
        console.error('Role assignment error:', error);
        await interaction.reply({
          content: '❌ Error assigning role!',
          ephemeral: true,
        });
      }
    } else if (subcommand === 'remove') {
      const member = interaction.options.getUser('member');
      const role = interaction.options.getRole('role');
      const reason = interaction.options.getString('reason') || 'No reason provided';

      try {
        const guildMember = await interaction.guild.members.fetch(member.id);

        if (!guildMember.roles.cache.has(role.id)) {
          return interaction.reply({
            content: `❌ ${member.tag} does not have the ${role.name} role!`,
            ephemeral: true,
          });
        }

        await guildMember.roles.remove(role);

        const removeEmbed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('✅ Role Removed')
          .addFields(
            { name: 'Member', value: member.tag, inline: true },
            { name: 'Role', value: role.name, inline: true },
            { name: 'Reason', value: reason, inline: false },
            { name: 'Removed by', value: interaction.user.tag, inline: true }
          )
          .setTimestamp();

        await interaction.reply({ embeds: [removeEmbed] });
      } catch (error) {
        console.error('Role removal error:', error);
        await interaction.reply({
          content: '❌ Error removing role!',
          ephemeral: true,
        });
      }
    } else if (subcommand === 'list') {
      const roles = interaction.guild.roles.cache
        .filter(role => role.name !== '@everyone')
        .sort((a, b) => b.position - a.position);

      if (roles.size === 0) {
        return interaction.reply({
          content: '❌ No roles found!',
          ephemeral: true,
        });
      }

      const listEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📋 Server Roles')
        .setDescription(`Total roles: ${roles.size}`)
        .addFields(
          roles.map(role => ({
            name: role.name,
            value: `Members: ${role.members.size} | Color: ${role.hexColor}`,
            inline: false,
          }))
        )
        .setFooter({ text: 'Grand Mafia - Role Management' })
        .setTimestamp();

      await interaction.reply({ embeds: [listEmbed] });
    } else if (subcommand === 'member-roles') {
      const member = interaction.options.getUser('member');

      try {
        const guildMember = await interaction.guild.members.fetch(member.id);
        const roles = guildMember.roles.cache
          .filter(role => role.name !== '@everyone')
          .map(role => `• ${role.name}`)
          .join('\n') || 'No roles';

        const memberRolesEmbed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle(`👤 ${member.tag} - Roles`)
          .setDescription(roles)
          .addFields(
            { name: 'Total Roles', value: `${guildMember.roles.cache.size - 1}`, inline: true },
            { name: 'Highest Role', value: guildMember.roles.highest.name, inline: true }
          )
          .setThumbnail(member.displayAvatarURL())
          .setTimestamp();

        await interaction.reply({ embeds: [memberRolesEmbed] });
      } catch (error) {
        console.error('Member roles error:', error);
        await interaction.reply({
          content: '❌ Error fetching member roles!',
          ephemeral: true,
        });
      }
    }
  },
};
