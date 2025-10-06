const inquirer = require('inquirer')
const chalk = require("chalk")
const { exec, spawn } = require('child_process')

const erro = chalk.bold.red
const success = chalk.bold.green
const info = chalk.bold.blue
const title = chalk.yellow.bold



async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function exibirMenu() {
    console.clear()
    console.log(title("========================================================== Bot Jubscreuda ==================================================================="))
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'menu',
                message: 'Selecione uma opção:',
                choices: [
                    { name: '📦 - Registrar Comando', value: 'resgistrar' },
                    { name: '🤖 - Iniciar o bot', value: 'iniciar' },
                    { name: '📦 - Instalar Dependências', value: 'instalar' },
                    { name: '📦 - Instalar Dependências Especificas', value: 'instalação-especifica' },
                    { name: '🚪 - Sair', value: 'sair' }
                ]
            }
        ]).then((resposta) => {
            switch (resposta.menu) {
                case 'resgistrar':
                    registrarComando()
                    break
                case 'iniciar':
                    iniciarBot()
                    break
                case 'sair':
                    console.log(info('Saindo...'))
                    process.exit(0)
                    break;
                case 'instalar':
                    instalarDependencias()
                    break;
                case 'instalação-especifica':
                    instalarDependenciasEspecificas()
                    break;

            }
        })
}

async function registrarComando() {
    console.clear()
    console.log(info("📦 Registrando comandos..."))

    exec(`node deploy-commands.js`, async (error, stdout, stderr) => {
        if (error) {
            console.error(erro(`Erro ao registrar o comando: ${error.message}`))
            return
        }
        if (stderr) {
            console.error(erro(`Erro: ${stderr}`))
            return
        }
        console.log('')
        console.log(success(`✅ - Comando registrado com sucesso!`))
        console.log('')
        await delay(2000)
        exibirMenu()
    })
}

function iniciarBot() {
    console.clear()
    const bot = spawn('node', ['index.js'], { stdio: 'inherit' })

    bot.on('error', (error) => {
        console.error(erro(`Erro ao iniciar o bot: ${error.message}`))
    })

    bot.on('close', (code) => {
        console.log(info(`Bot encerrado com o código: ${code}`))
    })
}

function instalarDependencias() {
    console.clear()
    console.log(info("🔧 Instalando dependências..."))

    exec(`npm install discord.js axios dotenv @napi-rs/canvas`, (error, stdout, stderr) => {
        if (error) {
            console.error(erro(`Erro ao instalar dependências: ${error.message}`))
            return
        }
        if (stderr) {
            console.error(erro(`Erro: ${stderr}`))
            return
        }
        console.log('')
        console.log(success(`✅ - Dependências instaladas com sucesso!`))
        console.log('')
        exibirMenu()
    })
}

async function instalarDependenciasEspecificas() {
    console.clear()

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'dependencias',
                message: 'Qual dependência você deseja instalar? (separe por espaço)',
            }
        ]).then((resposta) => {
            const dependencias = resposta.dependencias.trim()
            exec(`npm install ${dependencias}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(erro(`Erro ao instalar dependências: ${error.message}`))
                    return
                }
                if (stderr) {
                    console.error(erro(`Erro: ${stderr}`))
                    return
                }
                console.clear()
                console.log(info("🔧 Instalando dependências específicas..."))
                setTimeout(() => {
                    console.clear()
                    console.log('')
                    console.log(success(`✅ - Dependências instaladas com sucesso!`))
                    console.log('')
                }, 1000)
                exibirMenu()
            })
        })
}

process.on('SIGINT', async () => {
    console.clear()
    console.log(info('🚪- Saindo...'))
    await delay(1000)
    console.clear()
    console.log(info('🚪- Retornando ao menu principal...'))
    setTimeout(() => {
        exibirMenu()
    }, 1000)
})

exibirMenu()