// ============================================
// /guide — Backend‑Integrated Command
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
        .setName('guide')
        .setDescription('Create and manage game guides (Admin/Mod only)')
        .addSubcommand(sub =>
            sub
                .setName('create')
                .setDescription('Create a new game guide')
                .addStringOption(opt =>
                    opt
                        .setName('title')
                        .setDescription('Guide title')
                        .setRequired(true)
                )
                .addStringOption(opt =>
                    opt
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
                .addStringOption(opt =>
                    opt
                        .setName('content')
                        .setDescription('Guide content (use \\n for line breaks)')
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('post')
                .setDescription('Post a guide to a channel')
                .addStringOption(opt =>
                    opt
                        .setName('title')
                        .setDescription('Guide title')
                        .setRequired(true)
                )
                .addStringOption(opt =>
                    opt
                        .setName('channel')
                        .setDescription('Target channel ID')
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('list')
                .setDescription('List all guides')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

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
                    content: '❌ You do not have permission to use this command.',
                    ephemeral: true
                });
            }

            const subcommand = interaction.options.getSubcommand();

            // ============================================
            // CREATE GUIDE
            // ============================================
            if (subcommand === 'create') {
                const title = interaction.options.getString('title');
                const category = interaction.options.getString('category');
                const content = interaction.options.getString('content').replace(/\\n/g, '\n');

                // (G‑TASK) Save to DB later
                // await pool.query(
                //     'INSERT INTO guides (title, category, content, authorId) VALUES (?, ?, ?, ?)',
                //     [title, category, content, interaction.user.id]
                // );

                const confirmEmbed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('✅ Guide Created')
                    .setDescription(`Guide **"${title}"** has been created.`)
                    .addFields(
                        { name: 'Category', value: category, inline: true },
                        { name: 'Next Step', value: 'Use `/guide post` to publish this guide.' }
                    )
                    .setTimestamp();

                return interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
            }

            // ============================================
            // POST GUIDE
            // ============================================
            if (subcommand === 'post') {
                const title = interaction.options.getString('title');
                const channelId = interaction.options.getString('channel');

                const targetChannel = await interaction.guild.channels.fetch(channelId);
                if (!targetChannel) {
                    return interaction.reply({
                        content: '❌ Channel not found.',
                        ephemeral: true
                    });
                }

                // (G‑TASK) Fetch real guide content from DB later
                const placeholderContent = 'Guide content will be displayed here.';

                const guideEmbed = new EmbedBuilder()
                    .setColor('#FFD700')
                    .setTitle(`📖 ${title}`)
                    .setDescription(placeholderContent)
                    .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .setFooter({ text: 'Grand Mafia — Game Guide' })
                    .setTimestamp();

                await targetChannel.send({ embeds: [guideEmbed] });

                const confirmEmbed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('✅ Guide Posted')
                    .setDescription(`Guide **"${title}"** has been posted to <#${targetChannel.id}>`)
                    .setTimestamp();

                return interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
            }

            // ============================================
            // LIST GUIDES
            // ============================================
            if (subcommand === 'list') {
                const listEmbed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('📚 Available Guides')
                    .setDescription('Game guides by category')
                    .addFields(
                        {
                            name: '⚔️ Combat & Strategy',
                            value: '• Enforcers & Underbosses\n• Kingpins\n• UM Raids\n• Raid Coordination'
                        },
                        {
                            name: '💰 Economy & Resources',
                            value: '• Investments\n• Construction\n• Resource Management'
                        },
                        {
                            name: '🎯 War & Events',
                            value: '• Oakvale War\n• Kill Events\n• Raid Preparation'
                        },
                        {
                            name: '👑 Leadership',
                            value: '• Governors Guide\n• UM Raid Leaders\n• Leadership Tips'
                        }
                    )
                    .setFooter({ text: 'Use /guide create to add new guides' })
                    .setTimestamp();

                return interaction.reply({ embeds: [listEmbed] });
            }

        } catch (error) {
            console.error('❌ Guide command error:', error);

            return interaction.reply({
                content: '❌ Unexpected error while processing command.',
                ephemeral: true
            });
        }
    }
};
