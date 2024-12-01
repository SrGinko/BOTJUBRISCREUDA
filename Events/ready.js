const { Events } = require('discord.js');
const { addXp, addLVL } = require('../Controller');
const db = require('../db');


module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		async function addXpToVoiceChannelUsers(guild) {
			const voiceChannels = guild.channels.cache.filter(channel => channel.isVoiceBased());

			voiceChannels.forEach(channel => {
				channel.members.forEach(member => {
					if (!member.user.bot) {
						
						const userId = member.user.id
						const username = member.user.globalName

						try {
							const stmt = db.prepare(`
							  INSERT INTO users (id, username, xp, lvl, fundo) 
							  VALUES (?, ?, ?, ?, ?)
							`);
							stmt.run(userId, username, 0, 1, 1);

						} catch (error) {
							if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
		
								addXp(userId, 10)
								addLVL(userId)

							} else {
								console.error('Erro ao registrar usuário:', error);
							}
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
		}, 60000)
	}
}