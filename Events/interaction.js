const { Events } = require('discord.js')
const { controler } = require('../Controller')

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		controler(interaction)

		if (!interaction.isChatInputCommand()) return;
		const command = interaction.client.commands.get(interaction.commandName)

		if (!command) {
			console.error(`Comando ${interaction.commandName} não encontrado`)
		}
		try {
			await command.execute(interaction)
		} catch {
			await interaction.reply("Houve um erro ao executar o comando.")
		}
	}

}