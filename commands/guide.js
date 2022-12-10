const {
  SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guide')
    .setDescription('Posts a guide with buttons!'),
  async execute(interaction) {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('primary')
          .setLabel('Click me!')
          .setStyle(ButtonStyle.Primary),
      ).addComponents(
        new ButtonBuilder()
          .setLabel('Link')
          .setURL('https://github.com/RVCC-IDMX/discord-bot-ericbrown8787')
          .setStyle(ButtonStyle.Link),
      );
    await interaction.reply({ content: 'To open the guide, click the blurple button below, or click the gray Link button to visit this project\'s repository on GitHub', components: [row] });
  },
};
