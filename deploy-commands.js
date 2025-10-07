const { REST, Routes } = require('discord.js');
const chalk = require("chalk")
const dotenv = require('dotenv')
dotenv.config()
const { TOKEN, CLIENTE_ID, GUILD_ID } = process.env
const fs = require('node:fs');
const path = require('node:path');

const erro = chalk.bold.red
const success = chalk.bold.green
const info = chalk.bold.blue
const title = chalk.yellow.bold

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(title(`[⚠️ ] O Comando ${filePath} faltando a propriedade "data" ou "execute".`));
		}
	}
}

const rest = new REST().setToken(TOKEN);
(async () => {
	try {
		console.log(info(`Começando a carregar ${commands.length} comandos da aplicação (/）`));

		
		const data = await rest.put(
			Routes.applicationCommands(CLIENTE_ID, GUILD_ID),
			{ body: commands },
		);

		console.log(success(`Comandos carregados com sucesso! ${data.length} comandos carregados (/) `));
	} catch (error) {
		
		console.error(error);
	}
})();