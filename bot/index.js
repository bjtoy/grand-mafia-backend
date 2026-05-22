require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    REST,
    Routes
} = require('discord.js');

const { syncMemberRoles, syncAllMembers } = require('../roleSync');
const pool = require('../config/db');

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

    const slashCommands = [];

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);

        if (!command.data || !command.execute) {
            console.warn(`⚠ Skipped invalid command file: ${file}`);
            continue;
        }

        client.commands.set(command.data.name, command);
        slashCommands.push(command.data.toJSON());
    }

    return slashCommands;
}

// ============================================
// REGISTER SLASH COMMANDS
// ============================================

async function registerSlashCommands() {
    const slashCommands = loadCommands();

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('🔄 Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.DISCORD_CLIENT_ID,
                process.env.DISCORD_GUILD_ID
            ),
            { body: slashCommands }
        );

        console.log('✔ Slash commands registered');
    } catch (error) {
        console.error('❌ Failed to register slash commands:', error);
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

client.once('ready', async () => {
    console.log(`🤖 Bot logged in as ${client.user.tag}`);

    const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
    if (!guild) {
        console.error('❌ Guild not found. Check DISCORD_GUILD_ID.');
        return;
    }

    const members = await guild.members.fetch();
    await syncAllMembers(members);

    console.log('✔ Full member sync completed');
});

// ============================================
// MEMBER UPDATE EVENT
// ============================================

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const discordId = newMember.id;
    const roleIds = newMember.roles.cache.map(r => r.id);

    await syncMemberRoles(discordId, roleIds);
});

// ============================================
// COMMAND HANDLER
// ============================================

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, pool);
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
    loadEvents();
    await registerSlashCommands();
    await client.login(process.env.DISCORD_TOKEN);
}

startBot();

module.exports = client;
