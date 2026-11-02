import { Events, type GuildMember } from 'discord.js'

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember: GuildMember, newMember: GuildMember) {
        const boosterRole = newMember.guild.roles.cache.find(role => role.name === 'Server Booster')
        const burges = newMember.guild.roles.cache.find(role => role.name === 'Burgês')

        if (!boosterRole || !burges) return

        if (
            oldMember.roles.cache.has(boosterRole.id) &&
            !newMember.roles.cache.has(boosterRole.id)
        ) {
            await newMember.roles.remove(burges).catch(() => {})
            return
        }

        if (
            !oldMember.roles.cache.has(boosterRole.id) &&
            newMember.roles.cache.has(boosterRole.id)
        ) {
            const channel = newMember.guild.channels.cache.get('1031036295482454069')
            if (channel?.isTextBased() && channel.isSendable()) {
                await channel.send(`Obrigada ${newMember} por impulsionar o servidor! :heart:`)
            }
            await newMember.roles.add(burges).catch(() => {})
        }
    },
}
