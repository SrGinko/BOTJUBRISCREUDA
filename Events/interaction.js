const { Events, EmbedBuilder, Embed, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js')


const EndCitys = new EmbedBuilder()
	.setTitle('EndsCitys')
	.setColor('Purple')
	.addFields({ name: 'Clique aqui:', value: `https://discord.com/channels/1031036294433865850/1170598801648652439` })

const Nether = new EmbedBuilder()
	.setTitle('Nether')
	.setColor('Red')
	.addFields({ name: 'Clique aqui:', value: `https://discord.com/channels/1031036294433865850/1215493202069561355` })

const OverWorld = new EmbedBuilder()
	.setTitle('OverWorld')
	.setColor('Green')
	.addFields({ name: 'Clique aqui:', value: `https://discord.com/channels/1031036294433865850/1215493397230395452` })

const Alercchino = new EmbedBuilder()
	.setTitle('Alercchino')
	.setColor('Red')
	.setImage('https://media.discordapp.net/attachments/1119014051033403473/1233433159429914704/image.png?ex=662d13a5&is=662bc225&hm=8e6a584b2a8ab761fdf9b98fdb3910b776a5b8fb3cfe969ef64156228c3c34f1&=&format=webp&quality=lossless&width=550&height=220')



module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isStringSelectMenu()) {
			const select = interaction.values[0]

			switch (select) {
				case 'endscitys': await interaction.reply({ embeds: [EndCitys], ephemeral: true })
					break;
				case 'nether': await interaction.reply({ embeds: [Nether], ephemeral: true })
					break;
				case 'overworld': await interaction.reply({ embeds: [OverWorld], ephemeral: true })
			}

		}
		
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