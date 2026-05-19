import {
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';

import {
  sectionHeader,
  step,
  tip,
  warning,
  important,
  buildGuideContent,
  createGuideEmbed,
} from '../utils/guideStyles.js';

export default {
  data: new SlashCommandBuilder()
    .setName('guide-styled')
    .setDescription('Post a styled training guide for the server')
    .addStringOption(option =>
      option
        .setName('title')
        .setDescription('Title of the guide')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('category')
        .setDescription('Guide category (training, raids, enforcers, etc.)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const title = interaction.options.getString('title');
    const category = interaction.options.getString('category');

    /**
     * Example training guide structure.
     * You can later make this dynamic or driven by options/modals.
     */
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
      warning('Do not skip steps or improvise without approval.'),
    ]);

    const embed = createGuideEmbed(
      title,
      guideBody,
      category,
      interaction.user
    );

    await interaction.reply({
      embeds: [embed],
    });
  },
};