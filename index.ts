import { Client, GatewayIntentBits, Collection, Partials } from 'discord.js'
import { spawn } from 'child_process'
import chalk from 'chalk'
import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'

import type { DiscordClient } from './types/DiscordClient'

dotenv.config({ path: path.resolve(process.cwd(), 'config', '.env') });

const { TOKEN } = process.env ;
const erro = chalk.bold.red;
const info = chalk.bold.blue;
let restarting = false;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.DirectMessages
	],
	partials: [
		Partials.Channel,
		Partials.Message
	]
}) as DiscordClient;

function restartBot() {
	if (restarting) return;
	restarting = true;

	console.log(info('Reiniciando o BOT...'));

	if (process.stdin.isTTY) {
		process.stdin.setRawMode(false);
		process.stdin.pause();
	}

	const child = spawn(process.argv0, process.argv.slice(1), {
		cwd: process.cwd(),
		detached: true,
		stdio: 'inherit'
	})

	child.unref();

	client.destroy()
		.catch(console.error)
		.finally(() => {
			process.exit(0);
		});
}

client.commands = new Collection()

const foldersPath = path.join(__dirname, 'Commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder)
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
	for (const file of commandFiles) {
		const command = require(path.join(commandsPath, file))
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command)
		}
	}
}

const eventsPath = path.join(__dirname, 'Events')
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

if (process.stdin.isTTY) {
	process.stdin.setRawMode(true);
	process.stdin.resume();
	process.stdin.setEncoding('utf8');

	process.stdin.on('data', (key) => {
		const input = key.toString();

		if (input === '\u0003') {
			console.log(erro('Encerrando o BOT...'));
			process.exit();
		}

		if (input.toLowerCase() === 'r') {
			restartBot();
		}
	});
}

client.login(TOKEN);

export default client;