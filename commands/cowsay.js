const { SlashCommandBuilder } = require('discord.js');
const { say } = require('cowsay');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cowsay')
    .setDescription('Input text to make a cow say it!')
    .addStringOption((option) => option.setName('input')
      .setDescription('The input to echo back')
      .setRequired(true).setMaxLength(25)),
  async execute(interaction) {
    const moo = say({
      text: interaction.options.getString('input'),
    });
    await interaction.reply(`\`\`\`${moo}\`\`\``);
  },
};
