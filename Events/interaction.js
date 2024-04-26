const {Events, EmbedBuilder} = require('discord.js')


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




module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction){
        if (interaction.isStringSelectMenu()) {
		const select = interaction.values[0]

		switch (select) {
			case 'endscitys': await interaction.reply({ embeds: [EndCitys] })
				break;
			case 'nether': await interaction.reply({ embeds: [Nether] })
				break;
			case 'overworld': await interaction.reply({ embeds: [OverWorld] })
		}

	}
    if(interaction.isButton()){
		if(interaction.customId === "teste"){
			await interaction.reply("funcionou")
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
	}}
    
}