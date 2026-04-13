const { api } = require('../Utils/axiosClient')

async function addMenssage(discUser, quantidade, message) {
    try {
        const faladorBronze = message.guild.roles.cache.find(r => r.name === 'Falador Bronze')
        const faladorPrata = message.guild.roles.cache.find(r => r.name === 'Falador Prata')
        const faladorOuro = message.guild.roles.cache.find(r => r.name === 'Falador Ouro')
        const faladorPlatina = message.guild.roles.cache.find(r => r.name === 'Falador Platina')
        const faladorDiamante = message.guild.roles.cache.find(r => r.name === 'Falador Diamante')

        const user = await api.get(`/usuario/${discUser.id}`).then(res => res.data)
        const mensagens = user.quantidadeMensagens
        const novaQuantidade = mensagens + quantidade

        switch (novaQuantidade) {
            case 500:
                guildEvent.emit('conquista', { conquista: faladorBronze, xp: 500, user: message.author, channel: message.channel })
                addXp(message.author.id, 500)
                message.member.roles.add(faladorBronze).catch(console.error)
                break;
            case 1500:
                guildEvent.emit('conquista', { conquista: faladorPrata, xp: 1500, user: message.author, channel: message.channel })
                addXp(message.author.id, 1500)
                message.member.roles.add(faladorPrata).catch(console.error)
                if (message.member.roles.cache.has(faladorBronze)) {
                    message.member.roles.remove(faladorBronze)
                }
                message.member.roles.remove(faladorBronze).catch(console.error)
                break;
            case 3000:
                guildEvent.emit('conquista', { conquista: faladorOuro, xp: 3000, user: message.author, channel: message.channel })
                addXp(message.author.id, 3000)
                message.member.roles.add(faladorOuro).catch(console.error)
                if (message.member.roles.cache.has(faladorPrata)) {
                    message.member.roles.remove(faladorPrata)
                }
                break;
            case 5000:
                guildEvent.emit('conquista', { conquista: faladorPlatina, xp: 5000, user: message.author, channel: message.channel })
                addXp(message.author.id, 5000)
                message.member.roles.add(faladorPlatina).catch(console.error)
                if (message.member.roles.cache.has(faladorOuro)) {
                    message.member.roles.remove(faladorOuro)
                }
                break;
            case 10000:
                guildEvent.emit('conquista', { conquista: faladorDiamante, xp: 10000, user: message.author, channel: message.channel })
                addXp(message.author.id, 10000)
                message.member.roles.add(faladorDiamante).catch(console.error)
                if (message.member.roles.cache.has(faladorPlatina)) {
                    message.member.roles.remove(faladorPlatina)
                }
                break;
            default:
                break;
        }

        await api.patch(`/usuario/${discUser.id}`, {
            quantidadeMensagens: novaQuantidade
        })

    } catch (error) {
        console.log(error)
    }
}
module.exports = { addMenssage }