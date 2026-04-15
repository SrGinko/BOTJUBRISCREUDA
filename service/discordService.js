require('dotenv').config()

async function buscarMember(userId, guildId = process.env.GUILD_ID) {
    const client = require('../index')
    const resolvedGuildId = String(guildId ?? '').trim()

    if (!resolvedGuildId) {
        throw new Error('GUILD_ID nao foi definido no ambiente.')
    }

    const guild =
        client.guilds.cache.get(resolvedGuildId) ??
        await client.guilds.fetch(resolvedGuildId)

    if (!guild) {
        throw new Error(`Nao foi possivel localizar a guild ${resolvedGuildId}.`)
    }

    const member = await guild.members.fetch(userId)
    return member
}

module.exports = { buscarMember }
