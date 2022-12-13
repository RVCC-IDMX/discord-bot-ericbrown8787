const { SlashCommandBuilder } = require('discord.js');
const cowsay = require('cowsay');

async function getCowList() {
  function callback(error, names) {
    if (error) {
      return ['default'];
    }
    return names;
  }
  const cows = await cowsay.list(callback);
  return cows.map((cowfile) => cowfile.split('.')[0]);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cowsay')
    .setDescription('Input text to make a cow say it!')
    .addStringOption((option) => option.setName('input')
      .setDescription('The input to echo back')
      .setRequired(true))
    .addStringOption((option) => option.setName('cow')
      .setDescription('The cow to use')
      .setAutocomplete(true)),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = await getCowList();
    const filtered = choices.filter((choice) => choice.startsWith(focusedValue || 'a'));
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice })),
    );
  },
  async execute(interaction) {
    try {
      const moo = cowsay.say({
        text: interaction.options.getString('input'),
        f: interaction.options.getString('cow') || 'default',
      });
      // Sanitizing the cowsay output and fencing it off for Discord's Markdown rendering
      const formattedMoo = `\`\`\`${moo.replaceAll('`', '\'')}\`\`\``;
      await interaction.reply(formattedMoo);
    } catch (error) {
      await interaction.reply({ content: 'You have entered an invalid cow. Please consult the list.', ephemeral: true });
    }
  },
};
