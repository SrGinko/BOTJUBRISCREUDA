const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, SeparatorBuilder, MessageFlags, TextDisplayBuilder, SeparatorSpacingSize, MediaGalleryBuilder } = require('discord.js')
const { obterUnicoItem } = require('../Utils/itensInventario')
const { obterInimigos, obterUnicoInimigo, } = require('../Utils/getInimigo')
const { criarEmbed } = require('../Utils/embedFactory')
const rpgEvents = require('../Events/rpgEvents')

const batalhaCache = new Map

function barraDeVida(cur, max, len = 10) {
    const filled = Math.round((cur / max) * len)
    const empty = len - filled
    return '🟥'.repeat(filled) + '⬜'.repeat(empty) + ` ${cur}/${max}`
}

function criarInimigo(nivelPLayer, nome, hp, ataque, defesa, moeda, xp) {
    const scale = 0.8 + Math.random() * 0.6
    const level = Math.max(1, Math.round(nivelPLayer * scale))

    return {
        nome: nome,
        level: level,
        maxHp: hp + level * 10,
        hp: hp + level * 10,
        ataque: ataque + level * 3,
        defesa: defesa + level,
        moeda: moeda + level * 3,
        xp: xp + level * 5
    }
}

async function começarBatalha({ interaction, playerData, cliente, channel }) {

    const armadura = await obterUnicoItem(playerData.armaduraID)
    const arma = await obterUnicoItem(playerData.armaID)
    const calca = await obterUnicoItem(playerData.calcaID)

    const player = {
        id: interaction.user.id,
        nome: playerData.nome,
        nivel: playerData.level,
        maxHp: playerData.hp + armadura.heal ?? 0 + calca.heal ?? 0,
        hp: playerData.hp + armadura.heal ?? 0 + calca.heal ?? 0,
        attack: playerData.attack + arma.ataque ?? 0,
        defense: playerData.defense + armadura.defesa ?? 0 + calca.defesa ?? 0,
        xp: playerData.xp ?? 0,
        moeda: playerData.moeda ?? 0
    }

    const inimigos = obterInimigos()

    const enemy = await obterUnicoInimigo(1)


    const inimmigo = criarInimigo(player.nivel, enemy.nome, enemy.vida, enemy.ataque, enemy.defesa, Math.round(Math.random() * 150), Math.round(Math.random() * 200))

    if (batalhaCache.has(player.id)) {
        return channel.send({
            embeds: [
                criarEmbed({
                    description: 'Você já está em Batalha!',
                    color: 'Orange',
                    footer: 'Jubiscreuda RPG'
                })
            ]
        })
    }

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`rpg:attack:${player.id}`).setLabel('Ataque').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`rpg:heal:${player.id}`).setLabel('Curar').setStyle(ButtonStyle.Success).setDisabled(true),
        new ButtonBuilder().setCustomId(`rpg:run:${player.id}`).setLabel('Fugir').setStyle(ButtonStyle.Secondary)
    )

    const container = new ContainerBuilder({
        accent_color: 0x1f1f1f,
    })

    container.addTextDisplayComponents(
        new TextDisplayBuilder({
            content: `# ⚔️ A batalha Começou!`
        })
    )

    container.addSeparatorComponents(
        new SeparatorBuilder({
            spacing: SeparatorSpacingSize.Small
        })
    )

    container.addSeparatorComponents(
        new SeparatorBuilder({
            spacing: SeparatorSpacingSize.Large,
            divider: false
        })
    )

    container.addTextDisplayComponents(
        new TextDisplayBuilder({
            content: `**${player.nome}** \n  **❤️ Vida:** \`${barraDeVida(player.hp, player.maxHp)}\` \n \n **${inimmigo.nome}**\n  **❤️ Vida:** \`${barraDeVida(inimmigo.hp, inimmigo.maxHp)}\``
        })
    )

    container.addSeparatorComponents(
        new SeparatorBuilder({
            spacing: SeparatorSpacingSize.Large,
            divider: false
        })
    )

    container.addTextDisplayComponents(
        new TextDisplayBuilder({
            content: `> Informações da partida aqui... | Jubscreuda RPG`
        })
    )

    container.addActionRowComponents(row)

    const msg = await channel.send({ components: [container], flags: [MessageFlags.IsComponentsV2] })

    const battle = {
        id: player.id,
        user: interaction.user,
        player,
        inimmigo,
        message: msg,
        channel,
        row,
        turn: 'player',
        processing: false,
        timoutHandle: null
    }

    battle.timoutHandle = setTimeout(() => {
        if (batalhaCache.has(player.id)) {
            rpgEvents.emit('battleEnd', ({ battle, result: 'timeout' }))
        }
    }, 10 * 60 * 1000);

    batalhaCache.set(player.id, battle)

    rpgEvents.emit('battleStart', { battle })

    return battle

}

async function enemyTurn(batalha) {
    if (batalha.inimmigo.hp <= 0) return

    const damage = Math.max(0, Math.floor(batalha.inimmigo.ataque - batalha.player.defense + Math.random() * 5))
    batalha.player.hp = Math.max(0, batalha.player.hp - damage)

    rpgEvents.emit('enemyAttack', { batalha, damage: damage })

    await updateBattleMessage(batalha, `O inimigo atacou e causou **${damage}** de dano!`)

    if (batalha.player.hp <= 0) {
        await rewardsAndEnd(batalha, 'derrota')
    }
}


async function updateBattleMessage(batalha, recentText = 'Nada aqui...') {

    const container = new ContainerBuilder({
        accent_color: 0x1f1f1f,
    })

    container.addTextDisplayComponents(
        new TextDisplayBuilder({
            content: `# ⚔️ ${batalha.player.nome} X ${batalha.inimmigo.nome}`
        })
    )

    container.addSeparatorComponents(
        new SeparatorBuilder({
            spacing: SeparatorSpacingSize.Small
        })
    )

    container.addSeparatorComponents(
        new SeparatorBuilder({
            spacing: SeparatorSpacingSize.Large,
            divider: false
        })
    )

    container.addTextDisplayComponents(
        new TextDisplayBuilder({
            content: `**${batalha.player.nome}** \n  **❤️ Vida:** \`${barraDeVida(batalha.player.hp, batalha.player.maxHp)}\` \n \n **${batalha.inimmigo.nome}**\n  **❤️ Vida:** \`${barraDeVida(batalha.inimmigo.hp, batalha.inimmigo.maxHp)}\``
        })
    )

    container.addSeparatorComponents(
        new SeparatorBuilder({
            spacing: SeparatorSpacingSize.Large,
            divider: false
        })
    )

    container.addTextDisplayComponents(
        new TextDisplayBuilder({
            content: `> ${recentText} | Jubscreuda RPG`
        })
    )
    let components = [batalha.row]
    if (batalha.player.hp <= 0 || batalha.inimmigo.hp <= 0) {

        components = []
    }

    container.addActionRowComponents(components)


    await batalha.message.edit({ components: [container], flags: [MessageFlags.IsComponentsV2] })
}

async function rewardsAndEnd(batalha, result) {
    if (result === 'vitoria') {
        rpgEvents.emit('battleEnd', { batalha, result: 'vitoria' })
    } else if (result === 'derrota') {
        rpgEvents.emit('battleEnd', { batalha, result: 'derrota' })
    } else if (result === 'fuga') {
        rpgEvents.emit('battleEnd', { batalha, result: 'fuga' })

    } else if (result === 'timeout') {
        rpgEvents.emit('battleEnd', { batalha, result: 'timeout' })
    }

    clearTimeout(batalha.timoutHandle)

    batalhaCache.delete(batalha.id)
}

module.exports = { começarBatalha,updateBattleMessage, enemyTurn,rewardsAndEnd, getBattle: (userId) => batalhaCache.get(userId) }