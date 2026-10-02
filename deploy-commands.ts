import { REST, Routes } from 'discord.js';
import chalk from 'chalk';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), 'config', '.env') });

const {TOKEN, CLIENTE_ID, GUILD_ID} = process.env;

if (!TOKEN) {
	throw new Error('TOKEN não configurado no arquivo .env');
}

if (!CLIENTE_ID) {
	throw new Error('CLIENTE_ID não configurado no arquivo .env');
}

if (!GUILD_ID) {
	throw new Error('GUILD_ID não configurado no arquivo .env');
}

const erro = chalk.bold.red;
const success = chalk.bold.green;
const info = chalk.bold.blue;
const title = chalk.yellow.bold;

const commands: any[] = [];

const foldersPath = path.join(__dirname, 'Commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);

	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(
				title(
					`[⚠️] O comando ${filePath} está faltando a propriedade "data" ou "execute".`
				)
			);
		}
	}
}

const rest = new REST().setToken(TOKEN);

async function deployCommands(): Promise<void> {
	try {
		console.log(
			info(
				`Começando a carregar ${commands.length} comandos da aplicação (/)`
			)
		);

		const data = await rest.put(
			Routes.applicationGuildCommands(CLIENTE_ID!, GUILD_ID!),
			{
				body: commands
			}
		);
		const deployedCommands = data as { length: number };

		console.log(
			success(
				`Comandos carregados com sucesso! ${deployedCommands.length} comandos carregados (/)`
			)
		);

		console.clear();
	} catch (error) {
		console.error(erro('Erro ao carregar os comandos:'));
		console.error(error);
	}
}

deployCommands();