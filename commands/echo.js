const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Replies with your input!')
    .addStringOption((option) => option.setName('input')
      .setDescription('The input to echo back')
      .setRequired(true).setMaxLength(25)),
  async execute(interaction) {
    await interaction.reply(interaction.options.getString('input'));
  },

};
