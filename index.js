
const { Client, Events, GatewayIntentBits, Collection, ActivityType, messageLink } = require('discord.js');
const dotenv = require('dotenv')
dotenv.config()
const { TOKEN, CLIENTE_ID, GUILD_ID } = process.env
const fs = require('node:fs');
const path = require('node:path')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions] });

client.commands = new Collection()

const foldersPath = path.join(__dirname, 'Commands')
const commandfolders = fs.readdirSync(foldersPath)

for (const folder of commandfolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
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

client.on('ready', () => {
	client.user.setActivity({
		name: 'Minecraft',
		type: ActivityType.Playing
	})
})

client.on(Events.Raw, async (menssage) => {

	if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(menssage.t)) return
	const { d: data } = menssage;
	const guild = client.guilds.cache.get(data.guild_id)
	if (!guild) return

	const channel = guild.channels.cache.get(data.channel_id);
	if (!channel) return console.log(channel)

	const mensage1 = await channel.messages.fetch(data.messge_id)
	if (!mensage1) return console.log(mensage1)

	const member = await guild.members.fetch(data.user_id)
	if (!member) return console.log(member)

	const emoji = data.emoji.name

	const cargoCorVermelha = guild.roles.cache.find(r => r.name === 'Vermelho')
	const cargoCorLaranja = guild.roles.cache.find(r => r.name === 'Laranja')
	const cargoCorAmarelo = guild.roles.cache.find(r => r.name === 'Amarelo')
	const cargoCorVerde = guild.roles.cache.find(r => r.name === 'Verde')
	const cargoCorAzul = guild.roles.cache.find(r => r.name === 'Azul')
	const cargoCorRoxo = guild.roles.cache.find(r => r.name === 'Roxo')

	if (channel.id == '1293772024518414356') {
		if (menssage.t === 'MESSAGE_REACTION_ADD') {
			switch (emoji) {
				case '🔴':
					await member.roles.add(cargoCorVermelha)
					break;
				case '🟠':
					await member.roles.add(cargoCorLaranja)
					break;
				case '🟡':
					await member.roles.add(cargoCorAmarelo)
					break;
				case '🟢':
					await member.roles.add(cargoCorVerde)
					break;
				case '🔵':
					await member.roles.add(cargoCorAzul)
					break;
				case '🟣':
					await member.roles.add(cargoCorRoxo)
					break;
				default:
					break;
			}
		} else if (menssage.t === 'MESSAGE_REACTION_REMOVE') {
			switch (emoji) {
				case '🔴':
					await member.roles.remove(cargoCorVermelha)
					break;
				case '🟠':
					await member.roles.remove(cargoCorLaranja)
					break;
				case '🟡':
					await member.roles.remove(cargoCorAmarelo)
					break;
				case '🟢':
					await member.roles.remove(cargoCorVerde)
					break;
				case '🔵':
					await member.roles.remove(cargoCorAzul)
					break;
				case '🟣':
					await member.roles.remove(cargoCorRoxo)
					break;
				default:
					break;
			}
		}
	} return
})

client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isChatInputCommand()) return;
	console.log(interaction)
})

client.login(TOKEN);
