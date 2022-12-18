const {
  SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');
const cowsay = require('cowsay');

const charLimit = 500;
const generateDummyText = () => {
  let dummyText = '';
  for (let i = 0; i < charLimit; i += 1) { dummyText += 'A'; }
  return dummyText;
};

async function getCowList() {
  function callback(error, names) {
    if (error) {
      console.error('Cowsay: A request to retrieve the cowlist could not be completed.');
      return ['default'];
    }
    return names;
  }
  // Prohibited cows
  function checkProhibited(string) {
    try {
      const exclusionList = [
        'zen-noh-milk',
        'yasuna_08',
        'ibm',
        'beavis',
      ];
      let stillTrue = true;

      exclusionList.forEach((item) => {
        if (item === string) {
          stillTrue = false;
        }
      });

      if (stillTrue && (`\`\`\`${cowsay.say({ text: generateDummyText(), f: string })}\`\`\``).length > 1900) {
        stillTrue = false;
      }
      return stillTrue;
    } catch {
      return false;
    }
  }
  const cows = await cowsay.list(callback);
  // Returning an array of the cowfile names as strings
  // Filter denies access to a handful of apparently broken cowfiles that
  // I wasn't able to troubleshoot, as well as any cows that are over
  // 1400 characters after adding a basic message.
  return cows.map((cowfile) => cowfile.split('.')[0])
    .filter((name) => checkProhibited(name));
}
// note: cowList evaluates to a promise
const cowList = getCowList();

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
    const cowFile = interaction.options.getString('cow');
    if (cowFile && !choices.includes(cowFile)) {
      await interaction.reply({ content: 'It looks like the cow you entered is invalid. To see a list of valid cows you can use, type /cowsay help', ephemeral: true });
      return;
    }
    const cow = cowFile || 'default';
    if (message) {
      try {
        const moo = cowsay.say({
          text: message,
          f: cow,
        });

        // Sanitizing the cowsay output and fencing it off for Discord's Markdown rendering
        const delimiter = '\n';
        const cleanLine = '';
        const sanitizedMoo = moo.replaceAll('`', '\'').split(delimiter);
        sanitizedMoo[0] = cleanLine;
        sanitizedMoo[2] = cleanLine;
        const formattedMoo = `\`\`\`\n${sanitizedMoo.join(delimiter)}\`\`\``;

        await interaction.reply(formattedMoo);
      } catch (error) {
        // Handling any other errors from parts of Cowsay I couldn't personally audit
        console.error(error);
        await interaction.reply({ content: `It looks like there was an error processing your request: \n${error}`, ephemeral: true });
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
