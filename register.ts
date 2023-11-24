import { REST, Routes } from 'discord.js';
import cfg from './config.json' assert {type: "json"};
import path from "node:path";
import fs from 'node:fs';
import url from 'node:url';

const commands = [];

const filesPath = path.join(url.fileURLToPath(new URL('.', import.meta.url)), 'commands');
const actualCommandFiles = fs.readdirSync(filesPath);

const commandFiles = actualCommandFiles.filter(item => item !== 'template.js')

for (const file of commandFiles) {
	const filePath = path.join(filesPath, file);
	const command = await import(filePath);
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(cfg.token);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(cfg.clientId),
            { body: commands }
        ) as string[];

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
