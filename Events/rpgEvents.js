const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, MessageFlags } = require('discord.js')
const { EventEmitter } = require('events')
const { addXpHeroi, addXp } = require('../Utils/xp')
const rpgEvents = new EventEmitter()

const container = new ContainerBuilder()

rpgEvents.on('battleEnd', ({ batalha, result }) => {

    let xpGanho = batalha.inimmigo.xp
    let moedaGanha = batalha.inimmigo.moeda

    switch (result) {
        case 'vitoria':

            container.setAccentColor(0x11ff00)
            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: '# 🏅 Vitória!'
                })
            )
            container.addSeparatorComponents(
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large
                })
            )
            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `${batalha.user}, seu Heroi saiu Vitorioso! \n **XP Ganho:** ${xpGanho} \n **Moeda Ganha:** ${moedaGanha}`
                })
            )

            addXpHeroi(batalha.user.id, xpGanho)
            addXp(batalha.user.id,xpGanho)
            batalha.message.edit({ components: [container], flags: [MessageFlags.IsComponentsV2] })

            break;

        case 'derrota':
            xpGanho = Math.round(xpGanho / 2)

            container.setAccentColor(0xa30000)
            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: '# 💀 Derrota!'
                })
            )
            container.addSeparatorComponents(
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large
                })
            )
            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `${batalha.user}, seu Heroi foi  derrotado! \n **XP Ganho:** ${xpGanho} \n Moeda Ganha: 0`
                })
            )

            addXpHeroi(batalha.user.id, xpGanho)
            addXp(batalha.user.id,xpGanho)
            batalha.message.edit({ components: [container], flags: [MessageFlags.IsComponentsV2] })

            break;

        case 'fuga':

            xpGanho = Math.round(xpGanho / 4)

            container.setAccentColor(0x00c3ff)
            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: '# 💨 Você Fugiu!'
                })
            )
            container.addSeparatorComponents(
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large
                })
            )
            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `${batalha.user}, seu Heroi Fugiu! \n **XP Ganho:** ${xpGanho} \n Moeda Ganha: 0`
                })
            )

            addXpHeroi(batalha.user.id, xpGanho)
            addXp(batalha.user.id,xpGanho)
            batalha.message.edit({ components: [container], flags: [MessageFlags.IsComponentsV2] })

            break;

        case 'timeout':

            container.setAccentColor(0xffbb00)
            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: '# ⏳ Timeout!'
                })
            )
            container.addSeparatorComponents(
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large
                })
            )
            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `${batalha.user}, tempo de resposta acabou!`
                })
            )
            batalha.message.edit({ components: [container], flags: [MessageFlags.IsComponentsV2] })

        default:
            break;
    }
})



module.exports = rpgEvents 