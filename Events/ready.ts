import { ActivityType, Events, type Client, type Guild } from 'discord.js'
import { addXp } from '../Utils/xp'
import { chance } from '../Controller'

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client<true>) {
        console.log(`${client.user.tag} pronta pra uso!`)

        client.user.setActivity({
            name: 'Minecraft',
            type: ActivityType.Playing,
        })
        client.user.setStatus('online')

        async function addXpToVoiceChannelUsers(guild: Guild) {
            const voiceChannels = guild.channels.cache.filter(channel => channel.isVoiceBased())
            voiceChannels.forEach(channel => {
                if (channel.id === '1366801220374630400') return

                channel.members.forEach(member => {
                    if (member.user.bot) return

                    const userId = member.user.id
                    void addXp(userId, chance(10) ? 60 : 20)
                })
            })
        }

        setInterval(() => {
            const guild = client.guilds.cache.get('1031036294433865850')
            if (guild) void addXpToVoiceChannelUsers(guild)
        }, 80000)
    },
}
