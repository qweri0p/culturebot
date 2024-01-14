import { REST, Routes } from 'discord.js';
import path from "node:path";
import fs from 'node:fs';
import url from 'node:url';

const commands:JSON[] = [];

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

// and deploy your commands!
export async function register(token: string, client_id: string) {
    const rest = new REST().setToken(token);

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(client_id),
            { body: commands }
        ) as string[];

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
};
