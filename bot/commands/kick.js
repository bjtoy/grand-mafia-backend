// ============================================
// /kick — Backend‑Integrated Command
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
        .setName('kick')
        .setDescription('Kick a user from the server (Admin/Mod only)')
        .addUserOption(opt =>
            opt
                .setName('user')
                .setDescription('User to kick')
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt
                .setName('reason')
                .setDescription('Reason for kicking')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

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
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'No reason provided';

            const member = await interaction.guild.members.fetch(user.id).catch(() => null);

            if (!member) {
                return interaction.reply({
                    content: '❌ User not found in this server.',
                    ephemeral: true
                });
            }

            if (!member.kickable) {
                return interaction.reply({
                    content: '❌ I cannot kick this user. They may have higher permissions than me.',
                    ephemeral: true
                });
            }

            // ============================================
            // KICK USER
            // ============================================
            await member.kick(reason);

            // ============================================
            // KICK EMBED
            // ============================================
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
            console.error('❌ Kick error:', error);

            return interaction.reply({
                content: '❌ Error kicking user.',
                ephemeral: true
            });
        }
    }
};
