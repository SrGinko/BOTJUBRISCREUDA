const { Events } = require('discord.js')
const { controler, handleAction } = require('../Controller')
const { obterItens, obterUnicoItem } = require('../Utils/itensInventario')
const chalk = require("chalk")
const { apiTeste, api } = require('../Utils/axiosClient')
const guildEvent = require('./GuildEvent')
const { criarEmbed } = require('../Utils/embedFactory')
const { updateBattleMessage, enemyTurn, getBattle } = require('../RPG/battleManager')
const erro = chalk.bold.red


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		controler(interaction)

		if (interaction.isModalSubmit()) {

			const channel = await interaction.guild.channels.fetch('1428656070552850483')

			const [prefix, action, id] = interaction.customId.split(':')

			if (prefix === 'tv') {
				switch (action) {
					case 'addcanal':

						const nomeCanal = interaction.fields.getTextInputValue('canalNome')
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
			}if (prefix === 'rpg') {
				switch (action) {
					case 'curar':{
						const selecionados = interaction.fields.getStringSelectValues('consumivelSelect')
						const itensUsados = await Promise.all(selecionados.map(async (itemId) => {
							const res = await obterUnicoItem(Number(itemId))
							return res
						}))
						
						const curarAmount = itensUsados.reduce((acc, item) => acc + (item.heal || 0), 0)
						
						const batalha = getBattle(id)

						batalha.player.hp = Math.min(batalha.player.maxHp, batalha.player.hp + curarAmount)

						await interaction.deferUpdate();

						await updateBattleMessage(batalha, `Você usou itens e recuperou ${curarAmount} de vida!`)
						await enemyTurn(batalha)

					}
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