const { Events, EmbedBuilder } = require('discord.js')

function data() {
	const today = new Date();
	return today.getDay() === 4;
}

const materiaisPersonagens1 = new EmbedBuilder()
	.setTitle('Materiais de Talento dos Personagens')
	.setDescription('Hoje é dia de Farmar Talento dos Personagens')
	.setColor('#8a1e5d')
	.addFields(
		{name: 'Ensinamentos de Liberdade', value: '<:EL:1286190894780776448>'},
		{name: 'Ensinamentos de Prosperidade', value: '<:EP:1286191606755495937>'}
	)

const materiaisPersonagens2 = new EmbedBuilder()
	.setTitle('Materiais de Talento dos Personagens')
	.setDescription('Hoje é dia de Farmar Talento dos Personagens')
	.setColor('#8a1e5d')
	.addFields(
		{name: 'Ensinamentos de Esforço', value: '<:EE:1286199401337061378>'},
		{name: 'Ensinamentos de Resistência', value: '<:ER:1286199790178402356>'}
	)





module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		setInterval(() => {
			const date = new Date()

			if (date.getDay() === 1 || 4 && date.getHours() === 8 && date.getMinutes() === 0) {
				const channel = client.channels.cache.get('1042244690415730829');
				channel.send({ embeds:  [materiaisPersonagens1] })
			}
		}, 61000)

		setInterval(() => {
			const date = new Date()

			if (date.getDay() === 2 || 5 && date.getHours() === 8 && date.getMinutes() === 0) {
				const channel = client.channels.cache.get('1042244690415730829');
				channel.send({ embeds:  [materiaisPersonagens2] })
			}
		}, 61000)
	},
}