const { Events } = require('discord.js')
const { handleActionButton } = require('../handlers/buttonsHandler')
const { obterItens } = require('../Utils/itensInventario')
const chalk = require("chalk")
const { ModalHandleAction } = require('../handlers/modalHandler')
const { SelectMenusHandleAction } = require('../handlers/selectmenusHandler')
const erro = chalk.bold.red


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		if (interaction.isModalSubmit()) {
			ModalHandleAction(interaction)
		}

		if(interaction.isStringSelectMenu()) {
			SelectMenusHandleAction(interaction)
		}

		if (interaction.isButton()) {

			const res = await handleActionButton(interaction.customId, interaction.user, interaction)

			if (!res.ok) {
				return interaction.reply({ content: res.message, ephemeral: true })
			}

			if (!interaction.replied && !interaction.deferred) {
				await interaction.deferUpdate()
			}
		}


		if (interaction.isAutocomplete()) {

			if (interaction.commandName === 'loja') {
				const query = interaction.options.getFocused()

				const itens = await obterItens()

				const itensFilter = itens.filter(item => {
					return item.nome.toLowerCase().includes(query.toLowerCase())
				});

				const selections = itensFilter.slice(0, 10).map(item => ({
					name: item.nome,
					value: String(item.id)
				}));

				await interaction.respond(selections);
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
			console.log(interaction)
		} catch (error) {
			console.log(error)
		}
	}
}