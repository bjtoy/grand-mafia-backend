// ============================================
// /guide-styled — Backend‑Integrated Command
// Admin + Mod only
// ============================================

const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

const {
    sectionHeader,
    step,
    tip,
    warning,
    important,
    buildGuideContent,
    createGuideEmbed
} = require('../utils/guideStyles.js');

const { mapDiscordRolesToInternal } = require('../../services/roleSync.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guide-styled')
        .setDescription('Post a styled training guide for the server (Admin/Mod only)')
        .addStringOption(opt =>
            opt
                .setName('title')
                .setDescription('Title of the guide')
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt
                .setName('category')
                .setDescription('Guide category (training, raids, enforcers, etc.)')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

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
            const category = interaction.options.getString('category');

            // ============================================
            // BUILD GUIDE CONTENT
            // (Static example — will be dynamic in G‑tasks)
            // ============================================
            const guideBody = buildGuideContent([
                sectionHeader('Overview'),
                'This training guide outlines standard expectations and procedures.',

                sectionHeader('Responsibilities'),
                step(1, 'Read and understand the guide fully.'),
                step(2, 'Ask a senior member if anything is unclear.'),
                step(3, 'Apply these rules consistently.'),

                important('Failure to follow training procedures may result in warnings.'),

                sectionHeader('Tips'),
                tip('Take screenshots or notes for later reference.'),
                tip('Revisit this guide regularly.'),

                sectionHeader('Warnings'),
                warning('Do not skip steps or improvise without approval.')
            ]);

            // ============================================
            // BUILD EMBED
            // ============================================
            const embed = createGuideEmbed(
                title,
                guideBody,
                category,
                interaction.user
            );

            // ============================================
            // SEND GUIDE
            // ============================================
            await interaction.reply({
                embeds: [embed]
            });

        } catch (error) {
            console.error('❌ guide-styled command error:', error);

            return interaction.reply({
                content: '❌ Unexpected error while generating styled guide.',
                ephemeral: true
            });
        }
    }
};
