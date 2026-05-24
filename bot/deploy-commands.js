const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const __dirname = __dirname || path.dirname(require.main.filename);

const commands = [];
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
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
    console.error(error);
  }
})();
