// ============================================
// /channel-access — Backend‑Integrated Command
// Admin + Mod only
// ============================================

const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js');

const { mapDiscordRolesToInternal } = require('../../services/roleSync.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel-access')
        .setDescription('Manage channel access by role (Admin/Mod only)')
        .addSubcommand(sub =>
            sub
                .setName('allow-role')
                .setDescription('Allow a role to access a channel')
                .addChannelOption(opt =>
                    opt
                        .setName('channel')
                        .setDescription('Channel to manage')
                        .setRequired(true)
                )
                .addRoleOption(opt =>
                    opt
                        .setName('role')
                        .setDescription('Role to allow')
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('deny-role')
                .setDescription('Deny a role access to a channel')
                .addChannelOption(opt =>
                    opt
                        .setName('channel')
                        .setDescription('Channel to manage')
                        .setRequired(true)
                )
                .addRoleOption(opt =>
                    opt
                        .setName('role')
                        .setDescription('Role to deny')
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('view-permissions')
                .setDescription('View channel permissions')
                .addChannelOption(opt =>
                    opt
                        .setName('channel')
                        .setDescription('Channel to check')
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    cooldown: 3,

    async execute(interaction) {
        try {
            // ============================================
            // INTERNAL PERMISSION CHECK
            // ============================================
            const discordRoleIds = interaction.member.roles.cache.map(r => r.id);
            const internalRoles = mapDiscordRolesToInternal(discordRoleIds);

            if (!internalRoles.includes('Admin') && !internalRoles.includes('Mod')) {
                return interaction.reply({
                    content: '❌ You do not have permission to use this command.',
                    ephemeral: true
                });
            }

            // ============================================
            // GET OPTIONS
            // ============================================
            const subcommand = interaction.options.getSubcommand();
            const channel = interaction.options.getChannel('channel');

            // ============================================
            // ALLOW ROLE
            // ============================================
            if (subcommand === 'allow-role') {
                const role = interaction.options.getRole('role');

                try {
                    await channel.permissionOverwrites.create(role, {
                        ViewChannel: true,
                        SendMessages: true,
                        ReadMessageHistory: true
                    });

                    const embed = new EmbedBuilder()
                        .setColor('#00ff00')
                        .setTitle('✅ Role Access Allowed')
                        .addFields(
                            { name: 'Channel', value: channel.name, inline: true },
                            { name: 'Role', value: role.name, inline: true },
                            { name: 'Permissions', value: 'View, Send, Read History' }
                        )
                        .setTimestamp();

                    return interaction.reply({ embeds: [embed] });

                } catch (error) {
                    console.error('❌ Channel access error:', error);

                    return interaction.reply({
                        content: '❌ Error setting channel permissions.',
                        ephemeral: true
                    });
                }
            }

            // ============================================
            // DENY ROLE
            // ============================================
            if (subcommand === 'deny-role') {
                const role = interaction.options.getRole('role');

                try {
                    await channel.permissionOverwrites.create(role, {
                        ViewChannel: false,
                        SendMessages: false
                    });

                    const embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('🚫 Role Access Denied')
                        .addFields(
                            { name: 'Channel', value: channel.name, inline: true },
                            { name: 'Role', value: role.name, inline: true },
                            { name: 'Permissions', value: 'No access' }
                        )
                        .setTimestamp();

                    return interaction.reply({ embeds: [embed] });

                } catch (error) {
                    console.error('❌ Channel access error:', error);

                    return interaction.reply({
                        content: '❌ Error setting channel permissions.',
                        ephemeral: true
                    });
                }
            }

            // ============================================
            // VIEW PERMISSIONS
            // ============================================
            if (subcommand === 'view-permissions') {
                const permissions = channel.permissionOverwrites.cache;

                if (permissions.size === 0) {
                    return interaction.reply({
                        content: `✅ #${channel.name} has default permissions (no overrides).`,
                        ephemeral: true
                    });
                }

                const permissionsList = permissions
                    .map(perm => {
                        const target =
                            perm.type === 0
                                ? `<@&${perm.id}>`
                                : `<@${perm.id}>`;

                        const allow = perm.allow.toArray().join(', ') || 'None';
                        const deny = perm.deny.toArray().join(', ') || 'None';

                        return `${target}\n  ✅ Allow: ${allow}\n  ❌ Deny: ${deny}`;
                    })
                    .join('\n\n');

                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle(`🔐 #${channel.name} — Permissions`)
                    .setDescription(permissionsList)
                    .setFooter({ text: 'Grand Mafia — Channel Access' })
                    .setTimestamp();

                return interaction.reply({ embeds: [embed] });
            }

        } catch (error) {
            console.error('❌ Channel-access command error:', error);

            return interaction.reply({
                content: '❌ Unexpected error while processing command.',
                ephemeral: true
            });
        }
    }
};
