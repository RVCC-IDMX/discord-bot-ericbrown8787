const fs = require('node:fs');
const path = require('node:path');
const {
  Client, Events, GatewayIntentBits, Collection, EmbedBuilder,
} = require('discord.js');
// const { channel } = require('node:diagnostics_channel');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

// Dynamically populate client slash command list with all modules in commands directory
commandFiles.forEach((file) => {
  const filePath = path.join(commandsPath, file);
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const command = require(filePath);

  // Set a new item in the Collection
  // with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  // The following if block handles any input events that aren't slash commands

  // Do we have a command?

  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  } else if (interaction.isAutocomplete()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error(error);
    }
  } else if (interaction.customId === 'primary') {
    const guideEmbed = new EmbedBuilder()
      .setTitle('Guide')
      .setDescription('Thank you for choosing me over all of those other bots out there! \nYou can type / to display the list of available slash commands!')
      .setTimestamp();
    await interaction.reply({ embeds: [guideEmbed] });
  }
});

// Log in to Discord with your client's token
client.login(token);
