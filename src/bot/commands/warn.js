// ============================================
// /warn — Backend‑Integrated Command
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
        .setName('warn')
        .setDescription('Warn a user (Admin/Mod only)')
        .addUserOption(opt =>
            opt
                .setName('user')
                .setDescription('User to warn')
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt
                .setName('reason')
                .setDescription('Reason for warning')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    cooldown: 2,

    async execute(interaction, pool) {
        try {
            // ============================================
            // INTERNAL PERMISSION CHECK
            // ============================================
            const discordRoleIds = interaction.member.roles.cache.map(r => r.id);
            const internalRoles = mapDiscordRolesToInternal(discordRoleIds);

            if (!internalRoles.includes('Admin') && !internalRoles.includes('Mod')) {
                return interaction.reply({
                    content: '❌ You do not have permission to warn members.',
                    ephemeral: true
                });
            }

            // ============================================
            // GET OPTIONS
            // ============================================
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason');

            // ============================================
            // SEND DM TO USER
            // ============================================
            const warnDM = new EmbedBuilder()
                .setColor('#ff6600')
                .setTitle('⚠️ You Have Been Warned')
                .setDescription(`You received a warning in **${interaction.guild.name}**`)
                .addFields(
                    { name: 'Reason', value: reason },
                    { name: 'Moderator', value: interaction.user.tag }
                )
                .setTimestamp();

            try {
                await user.send({ embeds: [warnDM] });
            } catch {
                console.log(`⚠️ Could not DM ${user.tag}`);
            }

            // ============================================
            // PUBLIC CONFIRMATION EMBED
            // ============================================
            const warnEmbed = new EmbedBuilder()
                .setColor('#ff6600')
                .setTitle('⚠️ User Warned')
                .addFields(
                    { name: 'User', value: user.tag, inline: true },
                    { name: 'Reason', value: reason, inline: false },
                    { name: 'Moderator', value: interaction.user.tag, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [warnEmbed] });

            // ============================================
            // (OPTIONAL) LOG TO DATABASE — G‑TASK LATER
            // ============================================
            // await pool.query(
            //     'INSERT INTO mod_logs (action, userId, moderatorId, reason) VALUES (?, ?, ?, ?)',
            //     ['WARN', user.id, interaction.user.id, reason]
            // );

        } catch (error) {
            console.error('❌ Warn error:', error);

            return interaction.reply({
                content: '❌ Error warning user.',
                ephemeral: true
            });
        }
    }
};
