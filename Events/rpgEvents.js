const {
    ContainerBuilder,
    MessageFlags,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder
} = require('discord.js')
const { EventEmitter } = require('events')
const { addXpHeroi, addXp } = require('../Utils/xp')

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

async function applyRewards(players, rewards) {
    if (!rewards || (!rewards.xp && !rewards.moeda)) return

    for (const player of players) {
        await addXpHeroi(player.id, rewards.xp, rewards.moeda)
        await addXp(player.id, rewards.xp * 5)
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

function scheduleBattleMessageDeletion(batalha, delay = 5000) {
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
                    : `${ownerMention}, seu Heroi saiu vitorioso!\n**XP ganho:** ${rewards.xp}\n**Moeda ganha:** ${rewards.moeda}`

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
