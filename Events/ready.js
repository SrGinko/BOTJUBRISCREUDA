const { Events } = require('discord.js');
const { addXp } = require('../Controller');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		async function addXpToVoiceChannelUsers(guild) {
			const voiceChannels = guild.channels.cache.filter(channel => channel.isVoiceBased());

			voiceChannels.forEach(channel => {
				channel.members.forEach(member => {
					if(member.user.bot){
						const userId = member.user.id
						addXp(userId, 10)
					}
				});
			});
		}

		setInterval(() => {
			const guild = client.guilds.cache.get('1031036294433865850');
			if (guild) {
				addXpToVoiceChannelUsers(guild);
			}
		}, 300000)
	}
}