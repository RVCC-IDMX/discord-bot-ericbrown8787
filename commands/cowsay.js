const {
  SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');
const cowsay = require('cowsay');

async function getCowList() {
  function callback(error, names) {
    if (error) {
      console.error('Cowsay: A request to retrieve the cowlist could not be completed.');
      return ['default'];
    }
    return names;
  }

  const cows = await cowsay.list(callback);
  // Returning an array of the cowfile names as strings
  // Filter denies access to a handful of apparently broken cowfiles that
  // I wasn't able to troubleshoot, as well as any cows that are over
  // 1400 characters after adding a basic message.
  return cows.map((cowfile) => cowfile.split('.')[0])
    .filter((name) => ((name !== 'zen-noh-milk') && (name !== 'yasuna_08') && (name !== 'ibm')) && (`\`\`\`${cowsay.say({ text: 'Moo', cow: name })}\`\`\``.length < 1400));
}

const cowList = getCowList();
const charLimit = 250;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cowsay')
    .setDescription('Enter a short message to generate an ASCII art cow with a speech bubble')
    .addStringOption((option) => option.setName('message')
      .setDescription('A message to send via cow.')
      .setMaxLength(charLimit))
    .addStringOption((option) => option.setName('cow')
      .setDescription('The cow to use')
      .setAutocomplete(true))
    .addStringOption((option) => option.setName('help')
      .setDescription('Display a help dialog')
      .addChoices({ name: 'Help me!', value: 'help' })),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = await cowList;
    const filtered = choices.filter((choice) => choice.startsWith(focusedValue || 'a'));
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice })),
    );
  },
  async exportCowList() {
    const list = await cowList;
    return list;
  },
  async execute(interaction) {
    const choices = await cowList;
    const message = interaction.options.getString('message');
    const help = interaction.options.getString('help');
    // Confirming that the user isn't entering a prohibited or invalid cow.
    const cow = choices.includes(interaction.options.getString('cow')) ? interaction.options.getString('cow') : 'default';
    if (message) {
      try {
        // // This remains from my attempt to dynamically verify a legal character length.
        // // I decided it was a bad idea.
        // if (message.length > charLimit) {
        //   await interaction.reply({ content: `Your message is ${message.length}`
        // + ` characters long, which is WAAAY too many characters for me to handle at `
        // + `once when I'm making cool ASCII art. Please enter a message under `
        // + `${charLimit} characters.`, ephemeral: true });
        //   return;
        // }
        const moo = cowsay.say({
          text: message,
          f: cow,
        });

        // Sanitizing the cowsay output and fencing it off for Discord's Markdown rendering
        const formattedMoo = `\`\`\`${moo.replaceAll('`', '\'')}\`\`\``;

        await interaction.reply(formattedMoo);
      } catch (error) {
        await interaction.reply({ content: 'It looks like you\'ve entered an invalid cow. ', ephemeral: true });
      }
    } else if (help) {
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('cowsay-help')
            .setLabel('Show me a list of "cows"!')
            .setStyle(ButtonStyle.Primary),
        );
      await interaction.reply({
        content: `To use Cowsay, you can enter a message of ${charLimit} `
          + 'characters or less in the "message" field, and [optionally] enter a non-default "cow" in '
          + 'the cow field. If you\'re not sure what "cows" I\'m talking about, go right ahead and press '
          + 'the big blurple button below to display a list!',
        components: [row],
        ephemeral: true,
      });
    }
  },

};
