const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, MessageFlags } = require('discord.js')
const { EventEmitter } = require('events')
const { addXpHeroi, addXp } = require('../Utils/xp')
const rpgEvents = new EventEmitter()

rpgEvents.on('battleEnd', ({ batalha, result }) => {

    let xpGanho = batalha.inimmigo.xp
    let moedaGanha = batalha.inimmigo.moeda

    switch (result) {
        case 'vitoria':
            const containerVitoria = new ContainerBuilder()

            containerVitoria.setAccentColor(0x11ff00)
            containerVitoria.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: '# 🏅 Vitória!'
                })
            )
            containerVitoria.addSeparatorComponents(
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large
                })
            )
            containerVitoria.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `${batalha.user}, seu Heroi saiu Vitorioso! \n **XP Ganho:** ${xpGanho} \n **Moeda Ganha:** ${moedaGanha}`
                })
            )

            addXpHeroi(batalha.user.id, xpGanho)
            addXp(batalha.user.id, xpGanho)
            batalha.message.edit({ components: [containerVitoria], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })

            break;

        case 'derrota':

            const containerDerrota = new ContainerBuilder()


            xpGanho = Math.round(xpGanho / 2)

            containerDerrota.setAccentColor(0xa30000)
            containerDerrota.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: '# 💀 Derrota!'
                })
            )
            containerDerrota.addSeparatorComponents(
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large
                })
            )
            containerDerrota.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `${batalha.user}, seu Heroi foi  derrotado! \n **XP Ganho:** ${xpGanho} \n Moeda Ganha: 0`
                })
            )

            addXpHeroi(batalha.user.id, xpGanho)
            addXp(batalha.user.id, xpGanho)
            batalha.message.edit({ components: [containerDerrota], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })

            break;

        case 'fuga':

             const containerFuga = new ContainerBuilder()

            xpGanho = Math.round(xpGanho / 4)

            containerFuga.setAccentColor(0x00c3ff)
            containerFuga.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: '# 💨 Você Fugiu!'
                })
            )
            containerFuga.addSeparatorComponents(
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large
                })
            )
            containerFuga.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `${batalha.user}, seu Heroi Fugiu! \n **XP Ganho:** ${xpGanho} \n Moeda Ganha: 0`
                })
            )

            addXpHeroi(batalha.user.id, xpGanho)
            addXp(batalha.user.id, xpGanho)
            batalha.message.edit({ components: [containerFuga], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })

            break;

        case 'timeout':

             const containerTimeout = new ContainerBuilder()

            containerTimeout.setAccentColor(0xffbb00)
            containerTimeout.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: '# ⏳ Timeout!'
                })
            )
            containerTimeout.addSeparatorComponents(
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large
                })
            )
            containerTimeout.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `${batalha.user}, tempo de resposta acabou!`
                })
            )
            batalha.message.edit({ components: [containerTimeout], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })

        default:
            break;
    }
})



module.exports = rpgEvents 