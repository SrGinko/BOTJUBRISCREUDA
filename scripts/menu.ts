import { spawn } from 'node:child_process'
import { createInterface } from 'node:readline/promises'

type MenuChoice = '1' | '2' | '3' | '4' | '0'

async function askChoice(): Promise<string> {
	const terminal = createInterface({ input: process.stdin, output: process.stdout })
	try {
		return (await terminal.question('\nEscolha uma opção: ')).trim()
	} finally {
		terminal.close()
	}
}

function runNpm(args: string[]): Promise<number> {
	const npmCli = process.env.npm_execpath
	const executable = npmCli
		? process.execPath
		: process.platform === 'win32' ? 'npm.cmd' : 'npm'
	const commandArgs = npmCli ? [npmCli, ...args] : args

	return new Promise((resolve, reject) => {
		const child = spawn(executable, commandArgs, {
			cwd: process.cwd(),
			stdio: 'inherit',
			...(process.platform === 'win32' && !npmCli ? { shell: true } : {})
		})

		child.once('error', reject)
		child.once('exit', code => resolve(code ?? 1))
	})
}

async function runStep(label: string, script: string): Promise<boolean> {
	console.log(`\n=== ${label} ===`)
	const exitCode = await runNpm(['run', script])
	if (exitCode === 0) return true

	console.error(`\nA etapa "${label}" terminou com código ${exitCode}.`)
	return false
}

function showMenu(): void {
	console.log('\n╔════════════════════════════════════╗')
	console.log('║       BOT JUBI: MENU DE AÇÕES      ║')
	console.log('╠════════════════════════════════════╣')
	console.log('║  1. Criar build                    ║')
	console.log('║  2. Registrar comandos no Discord  ║')
	console.log('║  3. Inicializar o bot              ║')
	console.log('║  4. Build + registro + inicializar ║')
	console.log('║  0. Sair                           ║')
	console.log('╚════════════════════════════════════╝')
}

async function main(): Promise<void> {
	let running = true

	while (running) {
		showMenu()
		const choice = await askChoice() as MenuChoice | string

		switch (choice) {
			case '1':
				await runStep('Criando build', 'build')
				break
			case '2':
				console.log('Esta opção publica os comandos da aplicação no Discord.')
				await runStep('Registrando comandos', 'deploy')
				break
			case '3':
				await runStep('Inicializando bot', 'bot')
				break
			case '4':
				if (await runStep('Criando build', 'build')
					&& await runStep('Registrando comandos', 'deploy')
					&& await runStep('Inicializando bot', 'bot')) {
					console.log('\nO bot foi encerrado.')
				}
				break
			case '0':
				running = false
				break
			default:
				console.log('Opção inválida. Escolha 0, 1, 2, 3 ou 4.')
		}
	}

	console.log('Até mais!')
}

main().catch(error => {
	console.error('Erro no menu:', error)
	process.exitCode = 1
})
