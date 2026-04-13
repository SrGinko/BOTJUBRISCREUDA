const { Client, Events, GatewayIntentBits, Collection, ActivityType, Partials } = require('discord.js');
const { Player } = require('discord-player');
const chalk = require("chalk")
const dotenv = require('dotenv')
dotenv.config()
const { TOKEN } = process.env
const fs = require('node:fs');
const path = require('node:path');
const { DefaultExtractors } = require('@discord-player/extractor');

const erro = chalk.bold.red
const info = chalk.bold.blue


const client = new Client({
	intents:
		[
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.GuildVoiceStates,
			GatewayIntentBits.DirectMessages
		],
	partials:
		[
			Partials.Channel,
			Partials.Message
		]
});

client.commands = new Collection()
const player = new Player(client)
client.player = player

const foldersPath = path.join(__dirname, 'Commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(path.join(commandsPath, file));
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
	}
}

const eventsPath = path.join(__dirname, 'Events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

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
	process.stdin.setRawMode(true)
	process.stdin.resume()
	process.stdin.setEncoding('utf8')

	process.stdin.on('data', (key) => {
		if (key === '\u0003') {
			console.log(erro('❌ Encerrando o BOT...'))
			process.exit()
		}
		if (key.toLowerCase() === 'r') {
			console.log(info('🔄 Reiniciando o BOT...'))
			process.exitCode = 1
		}
	})

}

client.once(Events.ClientReady, async () => {
	await player.extractors.loadMulti(DefaultExtractors)
})
client.login(TOKEN);

module.exports = client 