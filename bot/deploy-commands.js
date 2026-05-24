console.log("Loaded CLIENT_ID:", process.env.CLIENT_ID);
const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env from project root (one directory above /bot)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    const cmd = command.data || command.default?.data;

    if (!cmd) continue;

    commands.push(cmd.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('🔄 Refreshing GLOBAL slash commands...');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log('✅ GLOBAL slash commands registered successfully!');
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
})();
