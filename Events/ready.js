const { Events } = require('discord.js');
const { addXp } = require('../Utils/xp');


module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`${client.user.tag} pronta pra uso!`);

		async function addXpToVoiceChannelUsers(guild) {
			const voiceChannels = guild.channels.cache.filter(channel => channel.isVoiceBased());

			voiceChannels.forEach(channel => {
				if (channel.id === '1366801220374630400') return

				channel.members.forEach(member => {
					if (!member.user.bot) {

						const userId = member.user.id

						let chance = Math.random()

						if (chance > 0.4) {
							addXp(userId, 10)
						} else if (chance < 0.3) {
							addXp(userId, 60)
						}
					}
				});
			});
		}

		setInterval(() => {
			const guild = client.guilds.cache.get('1031036294433865850');
			if (guild) {
				addXpToVoiceChannelUsers(guild);
			}
		}, 70000)
	}
}