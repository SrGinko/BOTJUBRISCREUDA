const { Events, EmbedBuilder } = require('discord.js')

function data() {
	const today = new Date();
	return today.getDay() === 4;
}

const Lembrete = new EmbedBuilder()
	.setTitle('Materiais de Talento dos Personagens')
	.setDescription('Reividique seus jogos gratis agora')
	.setColor('#d164a2')
	.addFields({name:'links de jogos', value: 'https://discord.com/channels/1031036294433865850/1038287340889706498'})

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		
		const agora = new Date()

		setInterval(() => {
			if(data() && agora.getHours() === 12 && agora.getMinutes() === 0){
				 const canal = client.channels.cache.get('1031036295482454069')
				 canal.send({embed: [Lembrete]})
			}
		}, 61000)
	}
}