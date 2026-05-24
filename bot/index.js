require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection
} = require('discord.js');

const fs = require('fs');
const path = require('path');

// ============================================
// DISCORD CLIENT
// ============================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

client.commands = new Collection();

// ============================================
// LOAD COMMANDS
// ============================================

function loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);

        if (!command.data || !command.execute) {
            console.warn(`⚠ Skipped invalid command file: ${file}`);
            continue;
        }

        client.commands.set(command.data.name, command);
    }
}

// ============================================
// LOAD EVENTS
// ============================================

function loadEvents() {
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);

        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }
    }
}

// ============================================
// BOT READY EVENT
// ============================================

client.once('ready', () => {
    console.log(`🤖 Bot logged in as ${client.user.tag}`);
});

// ============================================
// COMMAND HANDLER
// ============================================

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: '❌ An error occurred while executing this command.',
            ephemeral: true
        });
    }
});

// ============================================
// START BOT
// ============================================

async function startBot() {
    loadCommands();
    loadEvents();
    await client.login(process.env.DISCORD_TOKEN);
}

startBot();

module.exports = client;
