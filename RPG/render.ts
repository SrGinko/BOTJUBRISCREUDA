import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    MessageFlags,
    SectionBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder,
    ThumbnailBuilder,
} from 'discord.js'
import { getCurrentTurn } from './engine'
import type { Battle, BattleMode, Combatant, PvpChallenge } from '../types/RPG'

interface ChallengeContainerOptions {
    title?: string
    description: string
    challengeId?: string | null
    targetUserId?: string | null
    disabled?: boolean
    accentColor?: number
}

export function buildChallengeRow(
    challengeId: string,
    targetUserId: string,
    disabled = false,
): ActionRowBuilder<ButtonBuilder> {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId(`rpgduel:accept:${challengeId}:${targetUserId}`)
            .setLabel('Aceitar')
            .setStyle(ButtonStyle.Success)
            .setDisabled(disabled),
        new ButtonBuilder()
            .setCustomId(`rpgduel:decline:${challengeId}:${targetUserId}`)
            .setLabel('Recusar')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(disabled),
    )
}

export function createBattleActionRow(playerId: string, battleId: string, mode: BattleMode): ActionRowBuilder<ButtonBuilder> {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId(`rpg:attack:${playerId}:${battleId}`).setLabel('Ataque').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`rpg:heal:${playerId}:${battleId}`).setLabel('Curar').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`rpg:magia:${playerId}:${battleId}`).setLabel('Magia').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`rpg:run:${playerId}:${battleId}`).setLabel(mode === 'pvp' ? 'Desistir' : 'Fugir').setStyle(ButtonStyle.Secondary),
    )
}

export function buildChallengeContainer({
    title,
    description,
    challengeId,
    targetUserId,
    disabled = false,
    accentColor = 0x1f1f1f,
}: ChallengeContainerOptions): ContainerBuilder {
    const container = new ContainerBuilder({ accent_color: accentColor })
    if (title) {
        container.addTextDisplayComponents(new TextDisplayBuilder({ content: `# ${title}` }))
        container.addSeparatorComponents(new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large }))
    }

    container.addTextDisplayComponents(new TextDisplayBuilder({ content: description }))
    if (challengeId && targetUserId) {
        container.addActionRowComponents(buildChallengeRow(challengeId, targetUserId, disabled))
    }
    return container
}

export function scheduleChallengeMessageDeletion(challenge: PvpChallenge, delay = 10_000): void {
    if (!challenge.message) return
    setTimeout(() => void challenge.message?.delete().catch(() => null), delay)
}

export function barraDeVida(current: number, max: number, length = 10): string {
    const ratio = max > 0 ? current / max : 0
    const filled = Math.max(0, Math.min(length, Math.round(ratio * length)))
    return `HP ${'🟥'.repeat(filled)}${'⬛'.repeat(length - filled)} ${current}/${max}`
}

export function barraDeMana(current: number, max: number, length = 10): string {
    const ratio = max > 0 ? current / max : 0
    const filled = Math.max(0, Math.min(length, Math.round(ratio * length)))
    return `MP ${'🟦'.repeat(filled)}${'⬛'.repeat(length - filled)} ${current}/${max}`
}

function renderEnemy(container: ContainerBuilder, enemy: Combatant): void {
    let content = `**${enemy.nome}** Lv. ${enemy.level ?? enemy.nivel ?? 1}\n\`${barraDeVida(enemy.hp, enemy.maxHp)}\``
    if (enemy.effects.length) {
        content += `\nStatus: ${enemy.effects.map(effect => `${effect.sourceName}(${effect.remainingTurns})`).join(', ')}`
    }

    if (enemy.tipo === 'enemy' && enemy.imagem) {
        const section = new SectionBuilder().addTextDisplayComponents(new TextDisplayBuilder({ content }))
        section.setThumbnailAccessory(new ThumbnailBuilder({ media: { url: enemy.imagem } }))
        container.addSectionComponents(section)
        return
    }
    container.addTextDisplayComponents(new TextDisplayBuilder({ content }))
}

export function renderBattleContainer(battle: Battle, text: string): ContainerBuilder {
    const container = new ContainerBuilder({ accent_color: 0x1f1f1f })
    container.addTextDisplayComponents(
        new TextDisplayBuilder({ content: `# ⚔️ Batalha ${battle.mode === 'pvp' ? 'PvP' : ''}`.trim() }),
    )
    container.addSeparatorComponents(new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large }))

    for (const enemy of battle.enemies) renderEnemy(container, enemy)

    container.addSeparatorComponents(
        new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large, divider: true }),
    )

    for (const player of battle.players) {
        const level = player.nivel ?? player.level ?? 1
        const status = player.effects.length
            ? `\nStatus: ${player.effects.map(effect => `${effect.sourceName}(${effect.remainingTurns})`).join(', ')}`
            : ''
        container.addTextDisplayComponents(
            new TextDisplayBuilder({ content: `**${player.nome}** Lv. ${level}\n\`${barraDeVida(player.hp, player.maxHp)}\`${status}` }),
            new TextDisplayBuilder({ content: `\`${barraDeMana(player.mana, player.maxMana ?? 100)}\`` }),
        )
    }

    container.addSeparatorComponents(new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large }))
    const current = getCurrentTurn(battle)
    container.addTextDisplayComponents(
        new TextDisplayBuilder({ content: `> ${text}\nTurno: **${current?.nome ?? 'Ninguém'}**` }),
    )
    container.addActionRowComponents(battle.row)
    return container
}

export async function updateBattleMessage(battle: Battle, text: string, delay = 1_000): Promise<void> {
    if (delay > 0) await new Promise<void>(resolve => setTimeout(resolve, delay))
    await battle.message?.edit({
        components: [renderBattleContainer(battle, text)],
        flags: [MessageFlags.IsComponentsV2],
    })
}

export async function finalizeChallengeMessage(challenge: PvpChallenge, text: string): Promise<void> {
    if (!challenge.message) return
    await challenge.message.edit({
        components: [buildChallengeContainer({
            title: 'Resposta da Batalha',
            description: `${text}\n> Essa mensagem será apagada em alguns segundos.`,
            challengeId: challenge.id,
            targetUserId: challenge.targetUser.id,
            disabled: true,
            accentColor: 0x2b2d31,
        })],
        flags: [MessageFlags.IsComponentsV2],
    }).catch(() => null)
    scheduleChallengeMessageDeletion(challenge)
}
