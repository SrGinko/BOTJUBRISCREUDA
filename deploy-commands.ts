import { REST, Routes } from 'discord.js'
import chalk from 'chalk'
import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'

dotenv.config({ path: path.resolve(process.cwd(), 'config', '.env') })

const { TOKEN, CLIENTE_ID, GUILD_ID } = process.env
if (!TOKEN) throw new Error('TOKEN não configurado no arquivo .env')
if (!CLIENTE_ID) throw new Error('CLIENTE_ID não configurado no arquivo .env')
if (!GUILD_ID) throw new Error('GUILD_ID não configurado no arquivo .env')

function findJavaScriptFiles(directory: string): string[] {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const entryPath = path.join(directory, entry.name)
        if (entry.isDirectory()) return findJavaScriptFiles(entryPath)
        return entry.isFile() && entry.name.endsWith('.js') ? [entryPath] : []
    })
}

const commands: unknown[] = []
const commandFilesByName = new Map<string, string>()
const commandsPath = path.join(__dirname, 'Commands')

for (const filePath of findJavaScriptFiles(commandsPath)) {
    const command = require(filePath)
    if (!command?.data || typeof command.execute !== 'function') continue

    const commandData = command.data.toJSON()
    const previousFile = commandFilesByName.get(commandData.name)
    if (previousFile) {
        throw new Error(`Comando "/${commandData.name}" duplicado em "${previousFile}" e "${filePath}".`)
    }

    commandFilesByName.set(commandData.name, filePath)
    commands.push(commandData)
}

const rest = new REST().setToken(TOKEN)

async function deployCommands(): Promise<void> {
    try {
        console.log(chalk.bold.blue(`Carregando ${commands.length} comandos da aplicação (/).`))
        const data = await rest.put(Routes.applicationGuildCommands(CLIENTE_ID!, GUILD_ID!), { body: commands })
        console.log(chalk.bold.green(`Comandos carregados com sucesso: ${(data as unknown[]).length}.`))
    } catch (error) {
        console.error(chalk.bold.red('Erro ao carregar os comandos:'))
        console.error(error)
        process.exitCode = 1
    }
}

void deployCommands()
