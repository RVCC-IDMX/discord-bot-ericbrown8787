const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('secretping')
    .setDescription('Secretly replies with Secret Pong!'),
  async execute(interaction) {
    await interaction.reply({ content: 'Pong!', ephemeral: true });
  },
};
