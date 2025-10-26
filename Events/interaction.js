const { Events } = require('discord.js')
const { controler, handleAction } = require('../Controller')
const { obterItens } = require('../Utils/itensInventario')
const chalk = require("chalk")
const { apiTeste, api } = require('../Utils/axiosClient')
const guildEvent = require('./GuildEvent')
const { criarEmbed } = require('../Utils/embedFactory')
const erro = chalk.bold.red


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		controler(interaction)

		if (interaction.isModalSubmit()) {

			const channel = await interaction.guild.channels.fetch('1428656070552850483')

			const [prefix, action] = interaction.customId.split(':')

			if (prefix === 'tv') {
				switch (action) {
					case 'canais':

						const nomeCanal = interaction.fields.getTextInputValue('canalnome')
						const canalUrl = interaction.fields.getTextInputValue('canalUrl')
						const capaCanal = interaction.fields.getTextInputValue('capaUrl')

						api.post('/tv/canais', {
							nome: nomeCanal,
							url: canalUrl,
							capaUrl: capaCanal
						})
						interaction.reply({
							embeds: [
								criarEmbed({
									description: 'Encaminhado dados !',
									color: 'Green'
								})
							], flags: 64
						})
						guildEvent.emit('addcanal', { nomeCanal: nomeCanal, CapaCanal: capaCanal, channel: channel })

						break;

					default:
						break;
				}
			}
		}


		if (interaction.isButton()) {

			const res = await handleAction(interaction.customId, interaction.user, interaction)

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
			console.log(interaction)
		} catch (error) {
			console.log(error)
		}
	}
}