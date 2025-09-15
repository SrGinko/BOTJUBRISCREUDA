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
			} else if (prefix === 'agendar') {
				switch (action) {
					case 'lembrete':

						const { google } = require('googleapis');
						
						const detalhesLembrete = interaction.fields.getTextInputValue('detalhesLembrete')
						const dataHoraLembrete = interaction.fields.getTextInputValue('dataHoraLembrete')
						const fimDataHoraLembrete = interaction.fields.getTextInputValue('fimDataHoraLembrete')

						const jwt = new google.auth.JWT(
							'pedeohenriquecardoso@gmail.com',
							null,
							'06072004ph@',
							['https://www.googleapis.com/auth/calendar']
						);

						const calendar = google.calendar({ version: 'v3', auth: jwt })

						const inicioIso = new Date(dataHoraLembrete.replace(" ", "T") + ":00-03:00");
						const fimIso = new Date(fimDataHoraLembrete.replace(" ", "T") + ":00-03:00");

						const evento = {
							summary: detalhesLembrete,
							start: {
								dateTime: inicioIso,
								timeZone: 'America/Sao_Paulo',
							},
							end: {
								dateTime: fimIso,
								timeZone: 'America/Sao_Paulo',
							},
						};

						try {
							const res = await calendar.events.insert({
								calendarId: 'primary', 
								resource: evento,
							});

							await interaction.editReply(`Evento criado!\nLink: ${res.data.htmlLink}`);
						} catch (err) {
							console.error(err);
							await interaction.editReply("Deu ruim ao criar o evento.");
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