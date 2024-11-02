const { Events, EmbedBuilder } = require('discord.js')
const { execute } = require('./ready')

const embed = new EmbedBuilder()
	.setColor('Random')

module.exports = {
	name: Events.GuildMemberAdd,
	
	async execute(member) {

		const player = member.guild.roles.cache.find(r => r.name === 'Players')
		await member.roles.add(player)

	}
}