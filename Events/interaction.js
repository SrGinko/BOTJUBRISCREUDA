const { Events } = require('discord.js')
const { controler } = require('../Controller')
const { obterItens } = require('../Utils/itensInventario')
const chalk = require("chalk")
const { handleAction } = require('../RPG/battleManager')

const erro = chalk.bold.red


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		controler(interaction)

		if (interaction.isButton()) {
			const res = await handleAction(interaction.customId, interaction.user)

			if (!res.ok) {
				return interaction.reply({ content: res.message, ephemeral: true })
			}

			if (!interaction.replied && !interaction.deferred) {
				await interaction.deferUpdate()
			}
		}


		if (interaction.isAutocomplete()) {

			if (interaction.commandName === 'infoitem') {
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
		} catch (error) {
			console.log(error)
		}
	}
}