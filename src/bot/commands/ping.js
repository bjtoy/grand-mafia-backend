import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot latency and Discord API response time'),
  cooldown: 1,
  async execute(interaction) {
    const sent = await interaction.reply({ content: '🏓 Pinging...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    const pingEmbed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('🏓 Pong!')
      .addFields(
        { name: 'Bot Latency', value: `${latency}ms`, inline: true },
        { name: 'API Latency', value: `${apiLatency}ms`, inline: true }
      )
      .setFooter({ text: 'Grand Mafia Bot' })
      .setTimestamp();

    await interaction.editReply({ content: null, embeds: [pingEmbed] });
  },
};
