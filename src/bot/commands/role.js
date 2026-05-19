// ============================================
// /role — Backend‑Integrated Command
// Admin + Mod only
// ============================================

const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js');

const { mapDiscordRolesToInternal } = require('../../roleSync');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Manage member roles and permissions (Admin/Mod only)')
        .addSubcommand(sub =>
            sub
                .setName('assign')
                .setDescription('Assign a role to a member')
                .addUserOption(opt =>
                    opt
                        .setName('member')
                        .setDescription('Member to assign role to')
                        .setRequired(true)
                )
                .addRoleOption(opt =>
                    opt
                        .setName('role')
                        .setDescription('Role to assign')
                        .setRequired(true)
                )
                .addStringOption(opt =>
                    opt
                        .setName('reason')
                        .setDescription('Reason for assignment')
                        .setRequired(false)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('remove')
                .setDescription('Remove a role from a member')
                .addUserOption(opt =>
                    opt
                        .setName('member')
                        .setDescription('Member to remove role from')
                        .setRequired(true)
                )
                .addRoleOption(opt =>
                    opt
                        .setName('role')
                        .setDescription('Role to remove')
                        .setRequired(true)
                )
                .addStringOption(opt =>
                    opt
                        .setName('reason')
                        .setDescription('Reason for removal')
                        .setRequired(false)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('list')
                .setDescription('List all roles and their members')
        )
        .addSubcommand(sub =>
            sub
                .setName('member-roles')
                .setDescription('View all roles for a specific member')
                .addUserOption(opt =>
                    opt
                        .setName('member')
                        .setDescription('Member to check')
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    cooldown: 3,

    async execute(interaction, pool) {
        try {
            // ============================================
            // INTERNAL PERMISSION CHECK
            // ============================================
            const discordRoleIds = interaction.member.roles.cache.map(r => r.id);
            const internalRoles = mapDiscordRolesToInternal(discordRoleIds);

            if (!internalRoles.includes('Admin') && !internalRoles.includes('Mod')) {
                return interaction.reply({
                    content: '❌ You do not have permission to manage roles.',
                    ephemeral: true
                });
            }

            const subcommand = interaction.options.getSubcommand();

            // ============================================
            // ASSIGN ROLE
            // ============================================
            if (subcommand === 'assign') {
                const user = interaction.options.getUser('member');
                const role = interaction.options.getRole('role');
                const reason = interaction.options.getString('reason') || 'No reason provided';

                const guildMember = await interaction.guild.members.fetch(user.id).catch(() => null);

                if (!guildMember) {
                    return interaction.reply({
                        content: '❌ Member not found in this server.',
                        ephemeral: true
                    });
                }

                if (guildMember.roles.cache.has(role.id)) {
                    return interaction.reply({
                        content: `❌ ${user.tag} already has the **${role.name}** role.`,
                        ephemeral: true
                    });
                }

                await guildMember.roles.add(role, reason);

                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('✅ Role Assigned')
                    .addFields(
                        { name: 'Member', value: user.tag, inline: true },
                        { name: 'Role', value: role.name, inline: true },
                        { name: 'Reason', value: reason, inline: false },
                        { name: 'Assigned by', value: interaction.user.tag, inline: true }
                    )
                    .setTimestamp();

                return interaction.reply({ embeds: [embed] });
            }

            // ============================================
            // REMOVE ROLE
            // ============================================
            if (subcommand === 'remove') {
                const user = interaction.options.getUser('member');
                const role = interaction.options.getRole('role');
                const reason = interaction.options.getString('reason') || 'No reason provided';

                const guildMember = await interaction.guild.members.fetch(user.id).catch(() => null);

                if (!guildMember) {
                    return interaction.reply({
                        content: '❌ Member not found in this server.',
                        ephemeral: true
                    });
                }

                if (!guildMember.roles.cache.has(role.id)) {
                    return interaction.reply({
                        content: `❌ ${user.tag} does not have the **${role.name}** role.`,
                        ephemeral: true
                    });
                }

                await guildMember.roles.remove(role, reason);

                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('🗑️ Role Removed')
                    .addFields(
                        { name: 'Member', value: user.tag, inline: true },
                        { name: 'Role', value: role.name, inline: true },
                        { name: 'Reason', value: reason, inline: false },
                        { name: 'Removed by', value: interaction.user.tag, inline: true }
                    )
                    .setTimestamp();

                return interaction.reply({ embeds: [embed] });
            }

            // ============================================
            // LIST ROLES
            // ============================================
            if (subcommand === 'list') {
                const roles = interaction.guild.roles.cache
                    .filter(r => r.name !== '@everyone')
                    .sort((a, b) => b.position - a.position);

                if (roles.size === 0) {
                    return interaction.reply({
                        content: '❌ No roles found.',
                        ephemeral: true
                    });
                }

                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('📋 Server Roles')
                    .setDescription(`Total roles: **${roles.size}**`)
                    .addFields(
                        roles.map(role => ({
                            name: role.name,
                            value: `Members: ${role.members.size} | Color: ${role.hexColor}`,
                            inline: false
                        }))
                    )
                    .setFooter({ text: 'Grand Mafia — Role Management' })
                    .setTimestamp();

                return interaction.reply({ embeds: [embed] });
            }

            // ============================================
            // MEMBER ROLES
            // ============================================
            if (subcommand === 'member-roles') {
                const user = interaction.options.getUser('member');
                const guildMember = await interaction.guild.members.fetch(user.id).catch(() => null);

                if (!guildMember) {
                    return interaction.reply({
                        content: '❌ Member not found.',
                        ephemeral: true
                    });
                }

                const roles = guildMember.roles.cache
                    .filter(r => r.name !== '@everyone')
                    .map(r => `• ${r.name}`)
                    .join('\n') || 'No roles';

                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle(`👤 ${user.tag} — Roles`)
                    .setDescription(roles)
                    .addFields(
                        { name: 'Total Roles', value: `${guildMember.roles.cache.size - 1}`, inline: true },
                        { name: 'Highest Role', value: guildMember.roles.highest.name, inline: true }
                    )
                    .setThumbnail(user.displayAvatarURL())
                    .setTimestamp();

                return interaction.reply({ embeds: [embed] });
            }

        } catch (error) {
            console.error('❌ Role command error:', error);

            return interaction.reply({
                content: '❌ Unexpected error while processing role command.',
                ephemeral: true
            });
        }
    }
};
