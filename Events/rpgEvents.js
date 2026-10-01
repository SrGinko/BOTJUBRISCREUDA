const {
    ContainerBuilder,
    MessageFlags,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder
} = require('discord.js')
const { EventEmitter } = require('events')
const { addXpHeroi, addXp } = require('../Utils/xp')
const { addItem } = require('../Utils/itensInventario')
const { api } = require('../Utils/axiosClient')
const { player } = require('..')

const rpgEvents = new EventEmitter()

function mentionUser(id) {
    return id ? `<@${id}>` : 'Jogador'
}

function buildResultContainer({ color, title, description }) {
    const container = new ContainerBuilder().setAccentColor(color)

    container.addTextDisplayComponents(
        new TextDisplayBuilder({
            content: title
        })
    )

    container.addSeparatorComponents(
        new SeparatorBuilder({
            spacing: SeparatorSpacingSize.Large
        })
    )

    container.addTextDisplayComponents(
        new TextDisplayBuilder({
            content: `${description}\n> Essa mensagem sera apagada em alguns segundos.`
        })
    )

    return container
}

function formatRewards(rewards) {

    const linhas = []

    if (rewards.xp) {
        linhas.push(`**XP:** ${rewards.xp}`)
    }

    if (rewards.moeda) {
        linhas.push(`**Moedas:** ${rewards.moeda}`)
    }

    if (rewards.baus?.length) {

        rewards.baus.forEach(bau => {
            linhas.push(`**Baú** ${bau.tipo}`)
        })
    }

    console.log(rewards.baus.conteudo)

    if (rewards.baus?.length) {

        rewards.baus.forEach(baus => {
            baus.conteudo.forEach(items => {
                if (items.tipo === 'MOEDA') {
                    linhas.push(`**Moedas:** ${items.quantidade}`)
                }
                if (items.tipo === 'XP') {
                    linhas.push(`**XP:** ${items.quantidade}`)
                }
                if (items.tipo === 'ITEM') {
                    linhas.push(`**Item**: ${items.item.nome} x${items.quantidade}`)
                }
            })
        })
    }

    return linhas.join('\n')
}

async function applyRewards(players, rewards) {
    if (!rewards || (!rewards.xp && !rewards.moeda)) return

    for (const player of players) {
        if (rewards.xp || rewards.moeda) {
            await addXpHeroi(
                player.id,
                rewards.xp || 0,
                rewards.moeda || 0
            )

            await addXp(
                player.id,
                rewards.xp || 0
            )
        }
    }

    if (rewards.baus?.length) {

        for (const recompensa of rewards.baus) {
            recompensa.conteudo.forEach(reco => {
                if (reco.tipo === 'ITEM') {
                    addItem(player.id, reco.item.id)
                }

                console.log(player.id)
                
                if (reco.tipo === 'MOEDA') {
                     addXpHeroi(
                        player.id,
                        rewards.xp || 0,
                        rewards.moeda || 0
                    )

                    addXp(
                        player.id,
                        rewards.xp || 0
                    )
                }

                if (reco.tipo === 'XP') {
                     addXpHeroi(
                        player.id,
                        rewards.xp || 0,
                        rewards.moeda || 0
                    )

                     addXp(
                        player.id,
                        rewards.xp || 0
                    )
                }
            })
        }
    }
}

function getPvpParticipants(batalha) {
    const challenger = batalha.players[0] || null
    const opponent = batalha.enemies.find(enemy => enemy.isHuman) || null
    return { challenger, opponent }
}

function getPvpVictoryDescription(batalha, rewards) {
    const { challenger, opponent } = getPvpParticipants(batalha)
    const winner = challenger?.hp > 0 ? challenger : opponent
    const loser = winner?.id === challenger?.id ? opponent : challenger

    if (!winner || !loser) {
        return 'A batalha PvP terminou.'
    }

    return `**${winner.nome}** venceu o duelo contra **${loser.nome}** e você ganhou ${rewards.xp} XP.`
}

function getPvpDefeatDescription(batalha) {
    const { challenger, opponent } = getPvpParticipants(batalha)
    const loser = challenger?.hp <= 0 ? challenger : opponent
    const winner = loser?.id === challenger?.id ? opponent : challenger

    if (!winner || !loser) {
        return 'A batalha PvP terminou.'
    }

    return `**${loser.nome}** foi derrotado por **${winner.nome}**.`
}

function getPvpFleeDescription(batalha) {
    const { challenger, opponent } = getPvpParticipants(batalha)
    const quitter = challenger?.hp > 0 && opponent?.hp > 0 ? challenger : (challenger?.hp > 0 ? opponent : challenger)

    if (!quitter) {
        return 'Um dos jogadores desistiu do duelo.'
    }

    return `**${quitter.nome}** desistiu do duelo.`
}

async function updateBattleResultMessage(batalha, container) {
    await batalha.message.edit({
        components: [container],
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
    })
}

function scheduleBattleMessageDeletion(batalha, delay = 7000) {
    setTimeout(() => {
        batalha.message.delete().catch(() => null)
    }, delay)
}

rpgEvents.on('battleEnd', async ({ batalha, result, rewards }) => {
    try {
        const players = batalha.players || []
        const isPvp = batalha.mode === 'pvp'
        const ownerMention = mentionUser(batalha.user?.id)

        switch (result) {
            case 'vitoria': {
                const description = isPvp
                    ? getPvpVictoryDescription(batalha, rewards)
                    : `${ownerMention}, seu Heroi saiu vitorioso!\n## Recompensas \n ${formatRewards(rewards)}`

                const container = buildResultContainer({
                    color: 0x11ff00,
                    title: '# Vitoria!',
                    description
                })

                await applyRewards(players, rewards)
                await updateBattleResultMessage(batalha, container)
                scheduleBattleMessageDeletion(batalha)
                break
            }

            case 'derrota': {
                const description = isPvp
                    ? getPvpDefeatDescription(batalha)
                    : `${ownerMention}, seu Heroi foi derrotado.\n**XP ganho:** ${rewards.xp}\n**Moeda ganha:** 0`

                const container = buildResultContainer({
                    color: 0xa30000,
                    title: '# Derrota!',
                    description
                })

                await applyRewards(players, rewards)
                await updateBattleResultMessage(batalha, container)
                scheduleBattleMessageDeletion(batalha)
                break
            }

            case 'fuga': {
                const description = isPvp
                    ? getPvpFleeDescription(batalha)
                    : `${ownerMention}, seu Heroi fugiu.\n**XP ganho:** ${rewards.xp}\n**Moeda ganha:** 0`

                const container = buildResultContainer({
                    color: 0x00c3ff,
                    title: isPvp ? '# Duelo Encerrado!' : '# Voce Fugiu!',
                    description
                })

                await applyRewards(players, rewards)
                await updateBattleResultMessage(batalha, container)
                scheduleBattleMessageDeletion(batalha)
                break
            }

            case 'timeout': {
                const container = buildResultContainer({
                    color: 0xffbb00,
                    title: '# Timeout!',
                    description: `${ownerMention}, o tempo de resposta acabou.`
                })

                await updateBattleResultMessage(batalha, container)
                scheduleBattleMessageDeletion(batalha)
                break
            }

            default:
                break
        }
    } catch (error) {
        console.error('Erro ao processar battleEnd:', error)
    }
})

module.exports = rpgEvents
