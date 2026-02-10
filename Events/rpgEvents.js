const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, MessageFlags, calculateShardId } = require('discord.js')
const { EventEmitter } = require('events')
const { addXpHeroi, addXp } = require('../Utils/xp')
const { api } = require('../Utils/axiosClient')
const rpgEvents = new EventEmitter()

rpgEvents.on('battleEnd', ({ batalha, result }) => {

    let xpGanho = batalha.inimmigo.xp || 0
    let moedaGanha = batalha.inimmigo.moeda || 0

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
                    content: `${batalha.user}, seu Heroi saiu Vitorioso! \n **XP Ganho:** ${xpGanho} \n **Moeda Ganha:** ${moedaGanha} \n > Essa mensagem será apagada em alguns segundos.`
                })
            )

            addXpHeroi(batalha.user.id, xpGanho, moedaGanha)
            addXp(batalha.user.id, xpGanho)
            batalha.message.edit({ components: [containerVitoria], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })

            setTimeout(() => {
                batalha.message.delete()
            }, 5000);

            break;

        case 'derrota':

            const containerDerrota = new ContainerBuilder()

            xpGanho = Math.round(xpGanho / 4)


            containerDerrota.setAccentColor(0xa30000)
            containerDerrota.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: '# 💀 Derrota!'
                })
            )
            if (batalha.inimmigo.nome === 'Goblin' || batalha.inimmigo.nome === 'Ladrão') {
                if (Math.random() < 0.2) {
                    api.patch(`/heroi/${batalha.user.id}`, {
                        armaID: null,
                        armaduraID: null,
                        calcaID: null,
                    })
                    containerDerrota.addTextDisplayComponents(
                        new TextDisplayBuilder({
                            content: `> O Ladrão te roubou quando estava inconciente e seu Herói perdeu todo o equipamento na batalha!`
                        })
                    )
                }
            }
            containerDerrota.addSeparatorComponents(
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large
                })
            )
            containerDerrota.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `${batalha.user}, seu Heroi foi  derrotado! \n **XP Ganho:** ${xpGanho} \n Moeda Ganha: 0 \n > Essa mensagem será apagada em alguns segundos.`
                })
            )

            addXpHeroi(batalha.user.id, xpGanho)
            addXp(batalha.user.id, xpGanho)
            batalha.message.edit({ components: [containerDerrota], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })

            setTimeout(() => {
                batalha.message.delete()
            }, 5000);

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
                    content: `${batalha.user}, seu Heroi Fugiu! \n **XP Ganho:** ${xpGanho} \n Moeda Ganha: 0 \n > Essa mensagem será apagada em alguns segundos.`
                })
            )

            addXpHeroi(batalha.user.id, xpGanho)
            addXp(batalha.user.id, xpGanho)
            batalha.message.edit({ components: [containerFuga], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })

            setTimeout(() => {
                batalha.message.delete()
            }, 5000);

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
                    content: `${batalha.user}, tempo de resposta acabou! \n > Essa mensagem será apagada em alguns segundos.`
                })
            )
            batalha.message.edit({ components: [containerTimeout], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })

            setTimeout(() => {
                batalha.message.delete()
            }, 5000);

        default:
            break;
    }
})



module.exports = rpgEvents 