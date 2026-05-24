// ============================================
// /announce — Backend‑Integrated Command
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
        .setName('announce')
        .setDescription('Post an announcement to the server (Admin/Mod only)')
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
                .setDescription('Channel ID to post the announcement')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    cooldown: 5,

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
            const title = interaction.options.getString('title');
            const message = interaction.options.getString('message');
            const channelId = interaction.options.getString('channel');

            let targetChannel = interaction.channel;

            if (channelId) {
                const fetched = await interaction.guild.channels.fetch(channelId);
                if (!fetched) {
                    return interaction.reply({
                        content: '❌ Channel not found.',
                        ephemeral: true
                    });
                }
                targetChannel = fetched;
            }

            // ============================================
            // BUILD ANNOUNCEMENT EMBED
            // ============================================
            const announcementEmbed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle(`📢 ${title}`)
                .setDescription(message)
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setFooter({ text: 'Grand Mafia Faction Announcement' })
                .setTimestamp();

            await targetChannel.send({ embeds: [announcementEmbed] });

            // ============================================
            // CONFIRMATION EMBED
            // ============================================
            const confirmEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('✅ Announcement Posted')
                .setDescription(`Your announcement has been posted to <#${targetChannel.id}>`)
                .setTimestamp();

            await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });

        } catch (error) {
            console.error('❌ Announcement error:', error);

            return interaction.reply({
                content: '❌ Error posting announcement.',
                ephemeral: true
            });
        }
    }
};
