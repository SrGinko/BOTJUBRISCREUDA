const { Events } = require('discord.js')
const { handleActionButton } = require('../handlers/buttonsHandler')
const chalk = require("chalk")
const { ModalHandleAction } = require('../handlers/modalHandler')
const { SelectMenusHandleAction } = require('../handlers/selectmenusHandler')
const { criarEmbed } = require('../Utils/embedFactory')
const { handleError } = require('../handlers/errorsHandler')
const { handleGamesComponent } = require('../Commands/games/gamesComponent')
const { autocompleteGames } = require('../Commands/games/gamesAutocomplete')
const { autocompleteLoja } = require('../Commands/RPG/loja/autocomplete')
const erro = chalk.bold.red


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		if (interaction.isModalSubmit()) {
			return ModalHandleAction(interaction)
		}

		if (interaction.isStringSelectMenu()) {
			SelectMenusHandleAction(interaction)
		}

		if (interaction.isButton()) {
			if (interaction.customId.startsWith('games:')) {
				return handleGamesComponent(interaction)
			}

			const res = await handleActionButton(interaction.customId, interaction.user, interaction)

			if (!res.ok) {
				const reply = {
					embeds: [
						criarEmbed({
							description: res.message,
							color: 'Orange'
						})
					], flags: 64
				}
				return interaction.deferred || interaction.replied
					? interaction.followUp(reply)
					: interaction.reply(reply)
			}

			if (!interaction.replied && !interaction.deferred) {
				await interaction.deferUpdate()
			}
		}


		if (interaction.isAutocomplete()) {

			if (interaction.commandName === 'loja') {
				await autocompleteLoja(interaction)
			} else if (interaction.commandName === 'games') {
				await autocompleteGames(interaction)
			}

			return
		}

		if (!interaction.isChatInputCommand()) return;
		const command = interaction.client.commands.get(interaction.commandName)
		if (!command) {
			console.error(erro(`Comando ${interaction.commandName} não encontrado`))
		}
		try {
			await command.execute(interaction)
		} catch (error) {
			handleError(interaction, 'Ocorreu um erro ao executar esse comando', 'Erro de execução')
			console.log(error)
		}
	}
}
