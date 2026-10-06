import { api } from '../service/axiosClient'
import guildEvent from '../Events/GuildEvent.js'
import { addXp } from './xp'
import type { Message } from 'discord.js'
import type { User } from 'discord.js'
import { conquistas } from '../config/conquistas'


export async function addMenssage(discUser: User, quantidade: number, message: Message) {

    try {

        if (!message.guild || !message.member) return

        const cargos = {
            bronze: message.guild.roles.cache.find((r: any) => r.name === 'Falador Bronze'),
            prata: message.guild.roles.cache.find((r: any) => r.name === 'Falador Prata'),
            ouro: message.guild.roles.cache.find((r: any) => r.name === 'Falador Ouro'),
            platina: message.guild.roles.cache.find((r: any) => r.name === 'Falador Platina'),
            diamante: message.guild.roles.cache.find((r: any) => r.name === 'Falador Diamante')
        }

        const faladorBronze = cargos.bronze
        const faladorPrata = cargos.prata
        const faladorOuro = cargos.ouro
        const faladorPlatina = cargos.platina
        const faladorDiamante = cargos.diamante

        if (!faladorBronze || !faladorPrata || !faladorOuro || !faladorPlatina || !faladorDiamante) {
            console.error('Um ou mais cargos não encontrados.')
            return
        }

        const user = await api.get(`/usuario/${discUser.id}`).then(res => res.data)
        const mensagens = user.quantidadeMensagens
        const novaQuantidade = mensagens + quantidade

        const conquista = conquistas.find(c => c.messagens <= novaQuantidade && !message.member?.roles.cache.has(c.cargo))


        if (!conquista) {
            await api.patch(`/usuario/${discUser.id}`, {
                quantidadeMensagens: novaQuantidade
            })

            return
        }

        const cargo = message.guild.roles.cache.find((r: any) => r.name === conquista.cargo)

        if (!cargo) {
            console.error(`Cargo ${conquista.cargo} não encontrado.`)
            return
        }

    } catch (error) {
        console.log(error)
    }
}