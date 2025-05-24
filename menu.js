const inquirer = require('inquirer')
const chalk = require("chalk")
const { exec, spawn } = require('child_process')

const erro = chalk.bold.red
const success = chalk.bold.green
const info = chalk.bold.blue
const title = chalk.yellow.bold



async function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

function exibirMenu() {
    console.clear()
    console.log(title("Bot Jubscreuda"))
    inquirer
    .prompt([
        {
            type:'list',
            name:'menu',
            message:'Selecione uma opção:',
            choices: [
                { name: 'Registrar Comando', value: 'resgistrar' },
                { name: 'Iniciar o bot', value: 'iniciar' },
                { name: 'Sair', value: 'sair' }
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
                break
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
            console.log(success(`Comando registrado com sucesso!`))
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
        exibirMenu()
    })
}

exibirMenu()