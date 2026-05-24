// src/utils/guideStyles.js

const guideColorSchemes = {
  enforcers: 0xff3fd2,
  kingpins: 0xa13cff,
  raids: 0x4cc9ff,
  training: 0x7bff4f,
  default: 0x241338,
};

/**
 * Formats a section header
 */
const sectionHeader = title => `\n**${title.toUpperCase()}**\n`;

/**
 * Semantic callouts
 */
const tip = text => `✅ **Tip:** ${text}`;
const warning = text => `⚠️ **Warning:** ${text}`;
const important = text => `❗ **Important:** ${text}`;

/**
 * Step formatting for training guides
 */
const step = (number, text) =>
  `**Step ${number}:** ${text}`;

/**
 * Build a full guide body from structured sections
 */
const buildGuideContent = sections =>
  sections.join('\n\n');

/**
 * Create a Discord embed for guides
 */
const createGuideEmbed = (title, content, category, author) => ({
  title,
  description: content,
  color: guideColorSchemes[category] ?? guideColorSchemes.default,
  author: {
    name: author.username,
    icon_url: author.displayAvatarURL(),
  },
  footer: {
    text: 'Grand Mafia – Training Guide',
  },
  timestamp: new Date().toISOString(),
});

module.exports = {
  guideColorSchemes,
  sectionHeader,
  tip,
  warning,
  important,
  step,
  buildGuideContent,
  createGuideEmbed,
};
