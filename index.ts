import { Client, Events, GatewayIntentBits } from 'discord.js';
import path from "node:path";
import fs from 'node:fs';
import url from 'node:url'
import cfg from './config.json' assert {type: "json"};

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const filesPath = path.join(url.fileURLToPath(new URL('.', import.meta.url)), 'commands');
const commandFiles = fs.readdirSync(filesPath);

const commands = new Map()

for (const file of commandFiles) {
	const filePath = path.join(filesPath, file);
	const command = await import(filePath)
	if ('data' in command && 'execute' in command) {
		commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await interaction.deferReply()
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(cfg.token);