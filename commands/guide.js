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
    await interaction.reply({ content: 'I think you should,', components: [row] });
  },
};
