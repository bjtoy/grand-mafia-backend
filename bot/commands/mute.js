// ============================================
// /mute — Backend‑Integrated Command
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
        .setName('mute')
        .setDescription('Mute a user temporarily (Admin/Mod only)')
        .addUserOption(opt =>
            opt
                .setName('user')
                .setDescription('User to mute')
                .setRequired(true)
        )
        .addIntegerOption(opt =>
            opt
                .setName('duration')
                .setDescription('Duration in seconds (default: 300 = 5 minutes)')
                .setRequired(false)
        )
        .addStringOption(opt =>
            opt
                .setName('reason')
                .setDescription('Reason for muting')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

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
            const duration = interaction.options.getInteger('duration') || 300;
            const reason = interaction.options.getString('reason') || 'No reason provided';

            const member = await interaction.guild.members.fetch(user.id).catch(() => null);

            if (!member) {
                return interaction.reply({
                    content: '❌ User not found in this server.',
                    ephemeral: true
                });
            }

            // ============================================
            // APPLY TIMEOUT (MUTE)
            // ============================================
            await member.timeout(duration * 1000, reason);

            // ============================================
            // MUTE EMBED
            // ============================================
            const muteEmbed = new EmbedBuilder()
                .setColor('#ffa500')
                .setTitle('🔇 User Muted')
                .addFields(
                    { name: 'User', value: `${user.tag}`, inline: true },
                    { name: 'Duration', value: `${duration} seconds`, inline: true },
                    { name: 'Reason', value: reason, inline: false },
                    { name: 'Moderator', value: interaction.user.tag, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [muteEmbed] });

        } catch (error) {
            console.error('❌ Mute error:', error);

            return interaction.reply({
                content: '❌ Error muting user.',
                ephemeral: true
            });
        }
    }
};
