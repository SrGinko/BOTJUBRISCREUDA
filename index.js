const { Client, Events, GatewayIntentBits, Collection, ActivityType, Partials } = require('discord.js');
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');

const dotenv = require('dotenv')
dotenv.config()
const { TOKEN } = process.env
const fs = require('node:fs');
const path = require('node:path')

const client = new Client({
	intents:
		[
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildMessages,
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

const player = new Player(client);

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

client.on('ready', async () => {
	client.user.setActivity({
		name: 'Minecraft',
		type: ActivityType.Playing
	})
	client.user.setStatus('online')

	await player.extractors.loadMulti(DefaultExtractors)
})

client.login(TOKEN);

module.exports = client 