const { Events } = require('discord.js')
const { control } = require('../Controller')


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		control(interaction)

		if (!interaction.isChatInputCommand()) return;
		const command = interaction.client.commands.get(interaction.commandName)

		if (!command) {
			console.error(`comando ${interaction.commandName} não encontrado`)
		}
		try {
			await command.execute(interaction)
		} catch {
			await interaction.reply("Houve um erro ao executar o comando.")
		}
	}

}