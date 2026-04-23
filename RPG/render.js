const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    MessageFlags,
    SectionBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder,
    ThumbnailBuilder
} = require('discord.js')
const { getCurrentTurn } = require('./engine')

function buildChallengeRow(challengeId, targetUserId, disabled = false) {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`rpgduel:accept:${challengeId}:${targetUserId}`)
            .setLabel('Aceitar')
            .setStyle(ButtonStyle.Success)
            .setDisabled(disabled),
        new ButtonBuilder()
            .setCustomId(`rpgduel:decline:${challengeId}:${targetUserId}`)
            .setLabel('Recusar')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(disabled)
    )
}

function buildChallengeContainer({ title, description, challengeId = null, targetUserId = null, disabled = false, accentColor = 0x1f1f1f }) {
    const container = new ContainerBuilder({ accent_color: accentColor })

    if (title) {
        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: `# ${title}`
            })
        )

        container.addSeparatorComponents(
            new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large })
        )
    }

    container.addTextDisplayComponents(
        new TextDisplayBuilder({
            content: description
        })
    )

    if (challengeId && targetUserId) {
        container.addActionRowComponents(
            buildChallengeRow(challengeId, targetUserId, disabled)
        )
    }

    return container
}

function scheduleChallengeMessageDeletion(challenge, delay = 10000) {
    if (!challenge?.message) return

    setTimeout(() => {
        challenge.message.delete().catch(() => null)
    }, delay)
}

function barraDeVida(cur, max, len = 10) {
    const ratio = max > 0 ? cur / max : 0
    const filled = Math.max(0, Math.min(len, Math.round(ratio * len)))
    const empty = len - filled
    return 'HP '.concat('🟥'.repeat(filled), '⬛'.repeat(empty), ` ${cur}/${max}`)
}

function renderEnemy(container, enemy) {
    const content = `**${enemy.nome}**\n\`${barraDeVida(enemy.hp, enemy.maxHp)}\``

    if (enemy.tipo === 'enemy' && enemy.imagem) {
        const section = new SectionBuilder().addTextDisplayComponents(
            new TextDisplayBuilder({ content })
        )

        section.setThumbnailAccessory(
            new ThumbnailBuilder({
                media: { url: enemy.imagem }
            })
        )

        container.addSectionComponents(section)
        return
    }

    container.addTextDisplayComponents(
        new TextDisplayBuilder({ content })
    )
}

function renderBattleContainer(battle, text) {
    const container = new ContainerBuilder({ accent_color: 0x1f1f1f })

    container.addTextDisplayComponents(
        new TextDisplayBuilder({
            content: `# Batalha ${battle.mode === 'pvp' ? 'PvP' : ''}`.trim()
        })
    )

    container.addSeparatorComponents(
        new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large })
    )

    for (const enemy of battle.enemies) {
        renderEnemy(container, enemy)
    }

    container.addSeparatorComponents(
        new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large, divider: true })
    )

    for (const player of battle.players) {
        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: `**${player.nome}**\n\`${barraDeVida(player.hp, player.maxHp)}\``
            })
        )
    }

    container.addSeparatorComponents(
        new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large })
    )

    const current = getCurrentTurn(battle)

    container.addTextDisplayComponents(
        new TextDisplayBuilder({
            content: `> ${text}\nTurno: **${current?.nome || 'Ninguém'}**`
        })
    )

    container.addActionRowComponents(battle.row)
    return container
}

async function updateBattleMessage(battle, text) {
    await battle.message.edit({
        components: [renderBattleContainer(battle, text)],
        flags: [MessageFlags.IsComponentsV2]
    })
}

async function finalizeChallengeMessage(challenge, text) {
    if (!challenge?.message) return

    await challenge.message.edit({
        components: [
            buildChallengeContainer({
                title: 'Resposta da Batalha',
                description: `${text}\n> Essa mensagem sera apagada em alguns segundos.`,
                challengeId: challenge.id,
                targetUserId: challenge.targetUser.id,
                disabled: true,
                accentColor: 0x2b2d31
            })
        ],
        flags: [MessageFlags.IsComponentsV2]
    }).catch(() => null)

    scheduleChallengeMessageDeletion(challenge)
}

module.exports = {
    buildChallengeContainer,
    finalizeChallengeMessage,
    renderBattleContainer,
    updateBattleMessage
}
