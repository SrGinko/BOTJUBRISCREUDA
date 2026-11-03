import { MessageFlags, type ModalSubmitInteraction } from 'discord.js'
import { api } from '../../service/axiosClient'
import { criarEmbed } from '../../Utils/embedFactory'
import { addItem, equiparItem, obterUnicoItem, removeItem } from '../../service/itensInventario'
import { tryApplyStatusEffect } from '../engine'
import {
    checkBattleEnd,
    getBattleById,
    getCurrentTurn,
    nextTurn,
    processTurn,
    rewardsAndEnd,
    updateBattleMessage,
} from '../battleManager'

export async function handleRpgModal(interaction: ModalSubmitInteraction): Promise<void> {
    const [prefix, action, ownerId, battleId] = interaction.customId.split(':')
    if (prefix !== 'rpg') return

    if (action === 'equipar') {
        if (ownerId !== interaction.user.id) {
            await interaction.reply({ content: 'Este formulário pertence a outro jogador.', flags: MessageFlags.Ephemeral })
            return
        }
        const arma = interaction.fields.getStringSelectValues('arma')[0]
        const armadura = interaction.fields.getStringSelectValues('armadura')[0]
        const calca = interaction.fields.getStringSelectValues('calca')[0]
        await interaction.deferReply({ flags: MessageFlags.Ephemeral })
        await equiparItem(interaction.user.id, {
            arma: arma && arma !== '0' ? Number(arma) : undefined,
            armadura: armadura && armadura !== '0' ? Number(armadura) : undefined,
            calca: calca && calca !== '0' ? Number(calca) : undefined,
        })
        await interaction.editReply({ embeds: [criarEmbed({ description: 'Itens equipados com sucesso!', color: 'Green' })] })
        return
    }

    if (action === 'confirmarcompra') {
        const [itemIdRaw, buyerId] = interaction.customId.split(':').slice(2)
        if (buyerId !== interaction.user.id) {
            await interaction.reply({ content: 'Este formulário pertence a outro jogador.', flags: MessageFlags.Ephemeral })
            return
        }
        const itemId = Number(itemIdRaw)
        const quantity = Number(interaction.fields.getTextInputValue('quantidade'))
        if (!Number.isInteger(itemId) || itemId <= 0 || !Number.isInteger(quantity) || quantity <= 0) {
            await interaction.reply({ content: 'Informe um item e uma quantidade válidos.', flags: MessageFlags.Ephemeral })
            return
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral })
        const [item, heroResponse] = await Promise.all([
            obterUnicoItem(itemId),
            api.get<{ moeda: number }>(`/heroi/${interaction.user.id}`),
        ])
        const hero = heroResponse.data
        const totalPrice = (item.preco ?? 0) * quantity
        if (hero.moeda < totalPrice) {
            await interaction.editReply({ embeds: [criarEmbed({
                description: `Você não tem moedas suficientes para comprar ${quantity}x **${item.nome}**. Precisa de **${totalPrice}**, mas possui **${hero.moeda}**.`,
                color: 'Red',
            })] })
            return
        }

        await api.patch(`/heroi/${interaction.user.id}`, { moeda: hero.moeda - totalPrice })
        await addItem(interaction.user.id, itemId, quantity)
        await interaction.editReply({ embeds: [criarEmbed({
            description: `Você comprou ${quantity}x **${item.nome}** por **${totalPrice}** moedas!`,
            color: 'Green',
        })] })
        return
    }

    if (action !== 'curar' && action !== 'magia') return
    if (ownerId !== interaction.user.id) {
        await interaction.reply({ content: 'Este formulário pertence a outro jogador.', flags: MessageFlags.Ephemeral })
        return
    }

    const battle = getBattleById(battleId)
    if (!battle) {
        await interaction.reply({ content: 'Essa batalha já terminou.', flags: MessageFlags.Ephemeral })
        return
    }
    const current = getCurrentTurn(battle)
    const isParticipant = [...battle.players, ...battle.enemies]
        .some(participant => participant.id === interaction.user.id && participant.isHuman)
    if (!isParticipant) {
        await interaction.reply({ content: 'Você não faz parte dessa batalha.', flags: MessageFlags.Ephemeral })
        return
    }
    if (!current || current.id !== interaction.user.id) {
        await interaction.reply({ content: 'Não é seu turno.', flags: MessageFlags.Ephemeral })
        return
    }
    if (battle.processing) {
        await interaction.reply({ content: 'Uma ação já está em andamento. Aguarde.', flags: MessageFlags.Ephemeral })
        return
    }

    battle.processing = true
    try {
        if (action === 'curar') {
            await useHealingItems(interaction, battle, current)
        } else {
            await useMagic(interaction, battle, current)
        }
    } catch (error) {
        console.error('Erro ao processar formulário de batalha:', error)
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'Não foi possível concluir essa ação.', flags: MessageFlags.Ephemeral })
        }
    } finally {
        battle.processing = false
    }
}

async function useHealingItems(
    interaction: ModalSubmitInteraction,
    battle: NonNullable<ReturnType<typeof getBattleById>>,
    current: NonNullable<ReturnType<typeof getCurrentTurn>>,
): Promise<void> {
    const selectedIds = interaction.fields.getStringSelectValues('consumivelSelect')
    const items = await Promise.all(selectedIds.map(id => obterUnicoItem(Number(id))))
    const validItems = items.filter(item => item.tipo === 'CONSUMIVEL' && (item.heal ?? 0) > 0)
    if (!validItems.length) {
        await interaction.reply({ content: 'Selecione um consumível de cura válido.', flags: MessageFlags.Ephemeral })
        return
    }

    const totalHealing = validItems.reduce((total, item) => total + Math.floor((current.maxHp * (item.heal ?? 0)) / 100), 0)
    current.hp = Math.min(current.maxHp, current.hp + totalHealing)
    await interaction.deferUpdate()
    await updateBattleMessage(battle, `❤️ ${current.nome} recuperou ${totalHealing} de vida!`, 2_000)
    for (const item of validItems) await removeItem(current.id, item.id, 1)
    await continueBattle(battle)
}

async function useMagic(
    interaction: ModalSubmitInteraction,
    battle: NonNullable<ReturnType<typeof getBattleById>>,
    current: NonNullable<ReturnType<typeof getCurrentTurn>>,
): Promise<void> {
    const [selectedItemId] = interaction.fields.getStringSelectValues('magiaSelect')
    const [targetId] = interaction.fields.getStringSelectValues('targetSelect')
    const item = await obterUnicoItem(Number(selectedItemId))
    if (item.tipo !== 'MAGIA') {
        await interaction.reply({ content: 'Selecione uma magia válida.', flags: MessageFlags.Ephemeral })
        return
    }
    const target = [...battle.players, ...battle.enemies].find(participant => participant.id === targetId && participant.hp > 0)
    if (!target) {
        await interaction.reply({ content: 'Alvo inválido.', flags: MessageFlags.Ephemeral })
        return
    }
    const manaCost = item.mana ?? 0
    if (current.mana < manaCost) {
        await interaction.reply({
            embeds: [criarEmbed({ description: `Você não tem mana suficiente para usar **${item.nome}**.`, color: 'Blue' })],
            flags: MessageFlags.Ephemeral,
        })
        return
    }

    current.mana -= manaCost
    const damage = Math.max(0, Math.floor(item.ataque ?? 0))
    target.hp = Math.max(0, target.hp - damage)
    if (target.hp === 0) target.alive = false
    const status = target.alive ? tryApplyStatusEffect(item, target) : null
    await interaction.deferUpdate()
    const hitText = damage > 0
        ? `${current.nome} causou ${damage} de dano em ${target.nome}`
        : `${current.nome} usou ${item.nome} em ${target.nome}`
    await updateBattleMessage(battle, `✨ ${hitText}${status?.appliedStatusText ?? ''}`, 2_000)
    await continueBattle(battle)
}

async function continueBattle(battle: NonNullable<ReturnType<typeof getBattleById>>): Promise<void> {
    const result = checkBattleEnd(battle)
    if (result) {
        await rewardsAndEnd(battle, result)
        return
    }
    nextTurn(battle)
    await processTurn(battle)
}

