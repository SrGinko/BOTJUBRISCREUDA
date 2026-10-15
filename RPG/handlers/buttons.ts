import {
    ComponentType,
    LabelBuilder,
    MessageFlags,
    ModalBuilder,
    TextDisplayBuilder,
    type ButtonInteraction,
} from 'discord.js'
import { api } from '../../service/axiosClient'
import { obterItensInventario, obterUnicoItem } from '../../service/itensInventario'
import type { HeroData, InventoryEntry } from '../../types/RPG'
import {
    checkBattleEnd,
    comecarBatalha,
    finalizeChallengeMessage,
    getBattleById,
    getBattleByUser,
    getChallengeById,
    getCurrentTurn,
    nextTurn,
    performAttack,
    processTurn,
    removeChallenge,
    rewardsAndEnd,
    updateBattleMessage,
} from '../battleManager'

export interface RpgButtonResult {
    ok: boolean
    message?: string
}

export async function handleRpgButton(interaction: ButtonInteraction): Promise<RpgButtonResult> {
    const [prefix, action, userId, battleId] = interaction.customId.split(':')
    if (prefix === 'rpgduel') return handleChallengeButton(interaction, action, userId, battleId)
    if (prefix === 'rpg') return handleBattleButton(interaction, action, battleId)
    if (prefix === 'loja' && action === 'comprar') return showPurchaseModal(interaction, userId)
    return { ok: true }
}

async function handleChallengeButton(
    interaction: ButtonInteraction,
    action: string | undefined,
    challengeId: string | undefined,
    targetUserId: string | undefined,
): Promise<RpgButtonResult> {
    if (!action || !challengeId || !targetUserId) return { ok: false, message: 'Esse desafio é inválido.' }
    const challenge = getChallengeById(challengeId)
    if (!challenge) return { ok: false, message: 'Esse desafio não está mais disponível.' }
    if (interaction.user.id !== targetUserId) {
        return { ok: false, message: 'Somente o jogador desafiado pode responder a esse convite.' }
    }

    if (action === 'decline') {
        await interaction.deferUpdate()
        await finalizeChallengeMessage(challenge, `${challenge.targetUser} recusou o desafio de ${challenge.challengerUser}.`)
        removeChallenge(challenge)
        return { ok: true }
    }
    if (action !== 'accept') return { ok: false, message: 'Ação de desafio desconhecida.' }

    await interaction.deferUpdate()
    if (challenge.challengerUser.id === challenge.targetUser.id) {
        removeChallenge(challenge)
        return { ok: false, message: 'Desafio inválido.' }
    }
    if (getBattleByUser(challenge.challengerUser.id) || getBattleByUser(challenge.targetUser.id)) {
        await finalizeChallengeMessage(challenge, 'O desafio foi cancelado porque um dos jogadores entrou em outra batalha.')
        removeChallenge(challenge)
        return { ok: true }
    }

    const [challengerResponse, targetResponse] = await Promise.all([
        api.get<HeroData | null>(`/heroi/${challenge.challengerUser.id}`),
        api.get<HeroData | null>(`/heroi/${challenge.targetUser.id}`),
    ])
    if (!challengerResponse.data || !targetResponse.data) {
        await finalizeChallengeMessage(challenge, 'O desafio foi cancelado porque um dos jogadores não possui mais um herói válido.')
        removeChallenge(challenge)
        return { ok: true }
    }

    await finalizeChallengeMessage(challenge, `${challenge.targetUser} aceitou o desafio de ${challenge.challengerUser}! A batalha vai começar.`)
    removeChallenge(challenge)
    await comecarBatalha({
        interaction,
        playerData: challengerResponse.data,
        channel: challenge.channel,
        targetUser: challenge.targetUser,
        targetPlayerData: targetResponse.data,
        initiatorUser: challenge.challengerUser,
    })
    return { ok: true }
}

async function handleBattleButton(
    interaction: ButtonInteraction,
    action: string | undefined,
    battleId: string | undefined,
): Promise<RpgButtonResult> {
    const battle = getBattleById(battleId)
    if (!battle) return { ok: false, message: 'Nenhuma batalha ativa.' }
    const participant = [...battle.players, ...battle.enemies].find(person => person.id === interaction.user.id && person.isHuman)
    if (!participant) return { ok: false, message: 'Você não faz parte dessa batalha.' }

    const current = getCurrentTurn(battle)
    if (!current || current.id !== interaction.user.id) return { ok: false, message: 'Não é seu turno.' }
    if (battle.processing) return { ok: false, message: 'Ação em andamento, aguarde.' }
    battle.processing = true

    try {
        switch (action) {
            case 'attack': {
                await interaction.deferUpdate()
                const result = await performAttack(battle, current)
                await updateBattleMessage(battle, result.text, 1_000)
                const battleResult = result.result ?? checkBattleEnd(battle)
                if (battleResult) await rewardsAndEnd(battle, battleResult)
                else { nextTurn(battle); await processTurn(battle) }
                return { ok: true }
            }
            case 'run': {
                const successChance = battle.mode === 'pvp' ? 1 : 0.35
                if (Math.random() < successChance) {
                    const text = battle.mode === 'pvp' ? `${current.nome} desistiu da batalha!` : `${current.nome} fugiu!`
                    battle.fledBy = current.id
                    await interaction.deferUpdate()
                    await updateBattleMessage(battle, text, 1_000)
                    await rewardsAndEnd(battle, 'fuga')
                } else {
                    await interaction.deferUpdate()
                    await updateBattleMessage(battle, `${current.nome} tentou fugir e falhou!`, 1_000)
                    nextTurn(battle)
                    await processTurn(battle)
                }
                return { ok: true }
            }
            case 'heal':
                return await showHealingModal(interaction, battle.id, current.id)
            case 'magia':
                return await showMagicModal(interaction, battle.id, current.id, current.team === 'players'
                    ? battle.enemies.filter(target => target.hp > 0)
                    : battle.players.filter(target => target.hp > 0))
            default:
                return { ok: false, message: 'Ação de batalha desconhecida.' }
        }
    } catch (error) {
        console.error('Erro ao processar ação de batalha:', error)
        return { ok: false, message: 'Não foi possível concluir essa ação.' }
    } finally {
        battle.processing = false
    }
}

async function showHealingModal(interaction: ButtonInteraction, battleId: string, userId: string): Promise<RpgButtonResult> {
    const inventory: InventoryEntry[] = await obterItensInventario(userId)
    const items = inventory.filter(entry => entry.item.tipo === 'CONSUMIVEL' && (entry.item.heal ?? 0) > 0)
    if (!items.length) return { ok: false, message: 'Você não tem consumíveis de cura.' }

    const modal = new ModalBuilder({ title: 'Usar consumível', custom_id: `rpg:curar:${userId}:${battleId}` })
        .addTextDisplayComponents(new TextDisplayBuilder({ content: 'Selecione os consumíveis que deseja usar:' }))
        .addLabelComponents(new LabelBuilder({
            label: 'Consumíveis',
            description: 'A quantidade selecionada será usada na batalha.',
            component: {
                type: ComponentType.StringSelect,
                custom_id: 'consumivelSelect',
                required: true,
                max_values: items.length,
                min_values: 1,
                options: items.map(({ item, quantidade }) => ({
                    label: item.nome,
                    description: `Cura ${item.heal}% da vida | Quantidade: ${quantidade}`,
                    value: String(item.id),
                })),
            },
        }))
    await interaction.showModal(modal)
    return { ok: true }
}

async function showMagicModal(interaction: ButtonInteraction, battleId: string, userId: string, targets: Array<{id: string; nome: string; hp: number; maxHp: number}>): Promise<RpgButtonResult> {
    const inventory: InventoryEntry[] = await obterItensInventario(userId)
    const items = inventory.filter(entry => entry.item.tipo === 'MAGIA')
    if (!items.length) return { ok: false, message: 'Você não tem magias disponíveis.' }

    const modal = new ModalBuilder({ title: 'Usar magia', custom_id: `rpg:magia:${userId}:${battleId}` })
        .addTextDisplayComponents(new TextDisplayBuilder({ content: 'Selecione a magia e o alvo:' }))
        .addLabelComponents(new LabelBuilder({
            label: 'Magia',
            description: 'Selecione a magia que deseja usar.',
            component: {
                type: ComponentType.StringSelect,
                custom_id: 'magiaSelect',
                required: true,
                max_values: 1,
                min_values: 1,
                options: items.map(({ item }) => ({
                    label: item.nome,
                    description: `Dano: ${item.ataque ?? 0} | Custo de mana: ${item.mana ?? 0}`,
                    value: String(item.id),
                })),
            },
        }))
        .addLabelComponents(new LabelBuilder({
            label: 'Alvo',
            description: 'Selecione o alvo da magia.',
            component: {
                type: ComponentType.StringSelect,
                custom_id: 'targetSelect',
                required: true,
                max_values: 1,
                min_values: 1,
                options: targets.map(target => ({
                    label: target.nome,
                    description: `${target.hp}/${target.maxHp} HP`,
                    value: target.id,
                })),
            },
        }))
    await interaction.showModal(modal)
    return { ok: true }
}

async function showPurchaseModal(interaction: ButtonInteraction, rawItemId: string | undefined): Promise<RpgButtonResult> {
    const itemId = Number(rawItemId)
    if (!Number.isInteger(itemId) || itemId <= 0) return { ok: false, message: 'Item inválido.' }
    const item = await obterUnicoItem(itemId)
    const modal = new ModalBuilder({ title: 'Comprar item', custom_id: `rpg:confirmarcompra:${itemId}:${interaction.user.id}` })
        .addTextDisplayComponents(new TextDisplayBuilder({ content: `Você está comprando **${item.nome}**. Informe a quantidade:` }))
        .addLabelComponents(new LabelBuilder({
            label: 'Quantidade',
            description: `Preço unitário: ${item.preco} moedas.`,
            component: {
                type: ComponentType.TextInput,
                custom_id: 'quantidade',
                style: 1,
                required: true,
                min_length: 1,
                max_length: 2,
                placeholder: 'Digite a quantidade',
                value: '1',
            },
        }))
    await interaction.showModal(modal)
    return { ok: true }
}
