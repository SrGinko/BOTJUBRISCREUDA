import { api } from '../service/axiosClient'
import guildEvent from '../Events/GuildEvent.js'
import { addXp } from './xp'
import type { Message, Role } from 'discord.js'
import type { User } from 'discord.js'
import { Conquista, conquistas } from '../config/conquistas'


export async function addMenssage(discUser: User, quantidade: number, message: Message) {

    try {

        if (!message.guild || !message.member) return

        const user = await api.get(`/usuario/${discUser.id}`).then(res => res.data)
        const mensagens = user.quantidadeMensagens
        const novaQuantidade = mensagens + quantidade

        const conquista = [...conquistas].reverse().find((c: Conquista) => novaQuantidade >= c.messagens)

        if (!conquista) {
            await api.patch(`/usuario/${discUser.id}`, {
                quantidadeMensagens: novaQuantidade
            })

            return
        }

        const cargo = message.guild.roles.cache.find((r: Role) => r.name === conquista.cargo)

        if (!cargo) {
            console.error(`Cargo ${conquista.cargo} não encontrado.`)
            return
        }

        const jaPossuiCargo = message.member.roles.cache.has(cargo.id)

        if (jaPossuiCargo) {
            await api.patch(`/usuario/${discUser.id}`, {
                quantidadeMensagens: novaQuantidade
            })
            return
        }

        const indiceConquista = conquistas.findIndex((c: Conquista) => c.cargo === conquista.cargo)
        const conquistaAnterior = indiceConquista > 0 ? conquistas[indiceConquista - 1] : null

        if(conquistaAnterior) {
            const cargoAnterior = message.guild.roles.cache.find((r: Role) => r.name === conquistaAnterior.cargo)
            if (cargoAnterior && message.member.roles.cache.has(cargoAnterior.id)) {
                await message.member.roles.remove(cargoAnterior)
            }
        }

        await message.member.roles.add(cargo)
        await addXp(discUser.id, conquista.xp)

        guildEvent.emit('conquista', {
            conquista: cargo as Role,
            xp: conquista?.xp ?? 0,
            user: discUser.id,
            channel: message.channel
        })

        await api.patch(`/usuario/${discUser.id}`, {
            quantidadeMensagens: novaQuantidade
        })


    } catch (error) {
        console.log(error)
    }
}