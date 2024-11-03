const { Events, EmbedBuilder } = require('discord.js')
const { Hoje } = require('../Controller')

const embed = new EmbedBuilder()
	.setColor('Random')

module.exports = {
	name: Events.GuildMemberAdd,

	async execute(member) {

		const agora = Hoje()

		const user = member.user

		const avatar = member.user.displayAvatarURL({ dynamic: true, size: 1024 })

		const player = member.guild.roles.cache.find(r => r.name === 'Players')
		const channel = member.guild.channels.cache.find(ch => ch.name === 'bem-vindo')

		embed.setDescription(`Seja Bem vindo ao chat ${user}`)
		embed.setThumbnail(avatar)
		embed.setFooter({iconURL: 'https://i.ytimg.com/vi/s6V4BjURhOs/maxresdefault.jpg', text: `By Jubscreuda ∘ ${agora.horas}:${agora.minutos} - ${agora.ano}`})

			channel.send({ embeds: [embed] })

		await member.roles.add(player)

	}
}