import { EventEmitter } from 'node:events'
import {
    ContainerBuilder,
    MessageFlags,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder,
} from 'discord.js'
import { addXp, addXpHeroi } from '../Utils/xp'
import { addItem } from '../service/itensInventario'
import type { BattleEndPayload, BattleRewards, Combatant, LootReward } from '../types/RPG'

type RpgEvents = {
    battleEnd: [payload: BattleEndPayload]
}

class RpgEventEmitter extends EventEmitter {
    emit<K extends keyof RpgEvents>(event: K, ...args: RpgEvents[K]): boolean {
        return super.emit(event, ...args)
    }

    on<K extends keyof RpgEvents>(event: K, listener: (...args: RpgEvents[K]) => void): this {
        return super.on(event, listener)
    }
}

const rpgEvents = new RpgEventEmitter()

function mentionUser(id?: string): string {
    return id ? `<@${id}>` : 'Jogador'
}

function buildResultContainer(color: number, title: string, description: string): ContainerBuilder {
    return new ContainerBuilder({ accent_color: color })
        .addTextDisplayComponents(new TextDisplayBuilder({ content: title }))
        .addSeparatorComponents(new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large }))
        .addTextDisplayComponents(new TextDisplayBuilder({
            content: `${description}\n> Essa mensagem será apagada em alguns segundos.`,
        }))
}

function describeLootReward(reward: LootReward): string {
    if (reward.tipo === 'ITEM') return `**Item:** ${reward.item.nome} x${reward.quantidade}`
    return reward.tipo === 'MOEDA'
        ? `**Moedas:** ${reward.quantidade}`
        : `**XP:** ${reward.quantidade}`
}

function formatRewards(rewards: BattleRewards): string {
    const lines: string[] = []
    if (rewards.xp) lines.push(`**XP:** ${rewards.xp}`)
    if (rewards.moeda) lines.push(`**Moedas:** ${rewards.moeda}`)
    for (const chest of rewards.baus) {
        lines.push(`**Baú ${chest.tipo}**`)
        lines.push(...chest.conteudo.map(describeLootReward))
    }
    return lines.length ? lines.join('\n') : 'Sem recompensas adicionais.'
}

async function grantLootReward(player: Combatant, reward: LootReward): Promise<void> {
    if (reward.tipo === 'ITEM') {
        await addItem(player.id, reward.item.id, reward.quantidade)
    } else if (reward.tipo === 'MOEDA') {
        await addXpHeroi(player.id, 0, reward.quantidade)
    } else {
        await addXpHeroi(player.id, reward.quantidade, 0)
        await addXp(player.id, reward.quantidade)
    }
}

async function applyRewards(players: Combatant[], rewards: BattleRewards): Promise<void> {
    for (const player of players.filter(participant => participant.isHuman)) {
        if (rewards.xp || rewards.moeda) {
            await addXpHeroi(player.id, rewards.xp, rewards.moeda)
            await addXp(player.id, rewards.xp)
        }
        for (const chest of rewards.baus) {
            for (const reward of chest.conteudo) await grantLootReward(player, reward)
        }
    }
}

function getRewardRecipients(payload: BattleEndPayload): Combatant[] {
    const { batalha, result } = payload
    if (batalha.mode !== 'pvp') return batalha.players
    const survivingPlayers = [...batalha.players, ...batalha.enemies]
        .filter(player => player.isHuman && player.hp > 0)
    if (result === 'fuga' && batalha.fledBy) {
        return survivingPlayers.filter(player => player.id !== batalha.fledBy)
    }
    return result === 'timeout' ? [] : survivingPlayers
}

function getPvpParticipants(battle: BattleEndPayload['batalha']): { challenger: Combatant | null; opponent: Combatant | null } {
    return {
        challenger: battle.players[0] ?? null,
        opponent: battle.enemies.find(enemy => enemy.isHuman) ?? null,
    }
}

function getPvpVictoryDescription(battle: BattleEndPayload['batalha'], rewards: BattleRewards): string {
    const { challenger, opponent } = getPvpParticipants(battle)
    const winner = challenger && challenger.hp > 0 ? challenger : opponent
    const loser = winner?.id === challenger?.id ? opponent : challenger
    if (!winner || !loser) return 'A batalha PvP terminou.'
    return `**${winner.nome}** venceu o duelo contra **${loser.nome}** e ganhou ${rewards.xp} XP.`
}

function getPvpDefeatDescription(battle: BattleEndPayload['batalha']): string {
    const { challenger, opponent } = getPvpParticipants(battle)
    const loser = challenger && challenger.hp <= 0 ? challenger : opponent
    const winner = loser?.id === challenger?.id ? opponent : challenger
    if (!winner || !loser) return 'A batalha PvP terminou.'
    return `**${loser.nome}** foi derrotado por **${winner.nome}**.`
}

function getPvpFleeDescription(battle: BattleEndPayload['batalha']): string {
    const { challenger, opponent } = getPvpParticipants(battle)
    const quitterById = [challenger, opponent].find(player => player?.id === battle.fledBy)
    if (quitterById) return `**${quitterById.nome}** desistiu do duelo.`
    const quitter = challenger && opponent && challenger.hp > 0 && opponent.hp > 0
        ? challenger
        : (challenger?.hp ?? 0) > 0 ? opponent : challenger
    return quitter ? `**${quitter.nome}** desistiu do duelo.` : 'Um dos jogadores desistiu do duelo.'
}

async function updateBattleResultMessage(battle: BattleEndPayload['batalha'], container: ContainerBuilder): Promise<void> {
    await battle.message?.edit({ components: [container], flags: [MessageFlags.IsComponentsV2] })
}

function scheduleBattleMessageDeletion(battle: BattleEndPayload['batalha'], delay = 7_000): void {
    setTimeout(() => void battle.message?.delete().catch(() => null), delay)
}

rpgEvents.on('battleEnd', async ({ batalha, result, rewards }) => {
    try {
        const ownerMention = mentionUser(batalha.user.id)
        const isPvp = batalha.mode === 'pvp'
        let title = ''
        let description = ''
        let color = 0x1f1f1f

        switch (result) {
            case 'vitoria':
                title = '# Vitória!'
                description = isPvp
                    ? getPvpVictoryDescription(batalha, rewards)
                    : `${ownerMention}, seu herói saiu vitorioso!\n## Recompensas\n${formatRewards(rewards)}`
                color = 0x11ff00
                break
            case 'derrota':
                title = '# Derrota!'
                description = isPvp
                    ? getPvpDefeatDescription(batalha)
                    : `${ownerMention}, seu herói foi derrotado.\n${formatRewards(rewards)}`
                color = 0xa30000
                break
            case 'fuga':
                title = isPvp ? '# Duelo encerrado!' : '# Você fugiu!'
                description = isPvp
                    ? getPvpFleeDescription(batalha)
                    : `${ownerMention}, seu herói fugiu.\n${formatRewards(rewards)}`
                color = 0x00c3ff
                break
            case 'timeout':
                title = '# Tempo esgotado!'
                description = `${ownerMention}, o tempo de resposta acabou.`
                color = 0xffbb00
                break
        }

        if (result !== 'timeout') await applyRewards(getRewardRecipients({ batalha, result, rewards }), rewards)
        await updateBattleResultMessage(batalha, buildResultContainer(color, title, description))
        scheduleBattleMessageDeletion(batalha)
    } catch (error) {
        console.error('Erro ao processar o encerramento da batalha:', error)
    }
})

export default rpgEvents
