const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, SeparatorBuilder, MessageFlags, TextDisplayBuilder, SeparatorSpacingSize, SectionBuilder, ThumbnailBuilder } = require('discord.js')
const { randomUUID } = require('crypto')
const { obterUnicoItem } = require('../Utils/itensInventario')
const { obterUnicoInimigo } = require('../Utils/getInimigo')
const { criarEmbed } = require('../Utils/embedFactory')
const rpgEvents = require('../Events/rpgEvents')

// =========================
// CACHE
// =========================

const batalhaCache = new Map()
const playerBattleIndex = new Map()

function createBattleId() {
    return randomUUID()
}

function barraDeVida(cur, max, len = 10) {
    const filled = Math.round((cur / max) * len)
    const empty = len - filled
    return '🟥'.repeat(filled) + '⬜'.repeat(empty) + ` ${cur}/${max}`
}

// =========================
// BALANCEAMENTO
// =========================

function calcularForcaPlayer(player) {
    return player.nivel * 10 + player.attack * 2 + player.defense
}

function definirQuantidadeInimigos(player) {
    if (player.nivel < 15) return 1
    if (player.nivel < 20) return Math.random() < 0.7 ? 1 : 2
    if (player.nivel < 30) return Math.random() < 0.5 ? 2 : 3
    return 2 + Math.floor(Math.random() * 2)
}

function gerarInimigosBalanceados(player, enemiesDataList) {
    const quantidade = definirQuantidadeInimigos(player)

    const forcaTotal = calcularForcaPlayer(player) * 0.9
    const forcaPorInimigo = forcaTotal / quantidade

    const enemies = []

    for (let i = 0; i < quantidade; i++) {
        const base = enemiesDataList[Math.floor(Math.random() * enemiesDataList.length)]
        let enemy = criarInimigo(player.nivel, base)

        const basePower = enemy.ataque * 2 + enemy.defesa + enemy.maxHp / 3
        const scale = forcaPorInimigo / basePower

        enemy.ataque = Math.max(1, Math.floor(enemy.ataque * scale))
        enemy.defesa = Math.max(1, Math.floor(enemy.defesa * scale))
        enemy.maxHp = Math.max(5, Math.floor(enemy.maxHp * scale))
        enemy.hp = enemy.maxHp

        enemies.push(enemy)
    }

    return enemies
}

// =========================
// BUILDERS
// =========================

function buildPlayer(interaction, playerData, equips) {
    const { arma, armadura, calca } = equips

    return {
        id: interaction.user.id,
        nome: playerData.nome,
        tipo: 'player',
        nivel: playerData.level,

        maxHp: playerData.hp + (armadura?.heal ?? 0) + (calca?.heal ?? 0),
        hp: playerData.hp + (armadura?.heal ?? 0) + (calca?.heal ?? 0),

        attack: playerData.attack + (arma?.ataque ?? 0),
        defense: playerData.defense + (armadura?.defesa ?? 0) + (calca?.defesa ?? 0),

        speed: Math.floor(Math.random() * 10) + 1,
        alive: true
    }
}

function criarInimigo(nivelPLayer, enemyData) {
    const scale = 0.8 + Math.random() * 1.2
    const level = Math.max(1, Math.round(nivelPLayer * scale))

    return {
        id: `enemy_${Date.now()}_${Math.random()}`,
        nome: enemyData.nome,
        tipo: 'enemy',
        level,

        maxHp: enemyData.vida + level * 5,
        hp: enemyData.vida + level * 5,

        ataque: enemyData.ataque + level * 2,
        defesa: enemyData.defesa + level,

        moeda: Math.round(Math.random() * 60),
        xp: Math.round(Math.random() * 400),

        imagem: enemyData.imagem || 'Sem Imagem',
        speed: Math.floor(Math.random() * 10) + 1,
        alive: true
    }
}

// =========================
// TURN SYSTEM
// =========================

function generateTurnOrder(battle) {
    return [...battle.players, ...battle.enemies]
        .sort((a, b) => b.speed - a.speed)
}

function getCurrentTurn(battle) {
    return battle.turnOrder[battle.turnIndex]
}

function nextTurn(battle) {
    let attempts = 0

    do {
        battle.turnIndex++
        if (battle.turnIndex >= battle.turnOrder.length) {
            battle.turnIndex = 0
        }

        attempts++
        if (attempts > battle.turnOrder.length) break 
        
    } while (!battle.turnOrder[battle.turnIndex].alive)
}

// =========================
// CACHE HELPERS
// =========================

function getBattleByUser(userId) {
    const battleId = playerBattleIndex.get(userId)
    if (!battleId) return null
    return batalhaCache.get(battleId)
}

function getBattleById(battleId) {
    return batalhaCache.get(battleId)
}

function removeBattle(battle) {
    batalhaCache.delete(battle.id)
    for (const p of battle.players) {
        playerBattleIndex.delete(p.id)
    }
}

// =========================
// CORE
// =========================

async function começarBatalha({ interaction, playerData, channel }) {

    if (getBattleByUser(interaction.user.id)) {
        return channel.send({
            embeds: [criarEmbed({ description: 'Você já está em batalha!', color: 'Orange' })]
        })
    }

    const armadura = await obterUnicoItem(playerData.armaduraID)
    const arma = await obterUnicoItem(playerData.armaID)
    const calca = await obterUnicoItem(playerData.calcaID)

    const player = buildPlayer(interaction, playerData, { arma, armadura, calca })

    const enemiesDataList = [
        await obterUnicoInimigo(1),
        await obterUnicoInimigo(2),
        await obterUnicoInimigo(3)
    ]

    const enemies = gerarInimigosBalanceados(player, enemiesDataList)

    const battleId = createBattleId()

    const battle = {
        id: battleId,
        players: [player],
        enemies,
        turnIndex: 0,
        turnOrder: [],
        channel,
        message: null,
        processing: false,
        state: 'active',
        timeoutHandle: null
    }

    battle.turnOrder = generateTurnOrder(battle)

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`rpg:attack:${player.id}:${battleId}`).setLabel('Ataque').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`rpg:heal:${player.id}:${battleId}`).setLabel('Curar').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`rpg:run:${player.id}:${battleId}`).setLabel('Fugir').setStyle(ButtonStyle.Secondary)
    )

    battle.row = row

    const msg = await channel.send({
        components: [renderBattleContainer(battle, '⚔️ Batalha começou!')],
        flags: [MessageFlags.IsComponentsV2]
    })

    battle.message = msg

    batalhaCache.set(battleId, battle)
    playerBattleIndex.set(player.id, battleId)

    const current = getCurrentTurn(battle)

    if (current.tipo === 'enemy') {
        setTimeout(() => processTurn(battle), 1000)
    }

    return battle
}

// =========================
// RENDER
// =========================

function renderBattleContainer(battle, text) {
    const container = new ContainerBuilder({ accent_color: 0x1f1f1f })

    container.addTextDisplayComponents(
        new TextDisplayBuilder({ content: `# ⚔️ Batalha` })
    )

    container.addSeparatorComponents(
        new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large })
    )

    for (const enemy of battle.enemies) {
        container.addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder({
                        content: `**${enemy.nome}**\n❤️ \`${barraDeVida(enemy.hp, enemy.maxHp)}\`\n`
                    })
                )
                .setThumbnailAccessory(
                new ThumbnailBuilder({
                    media: { url: enemy.imagem }
                })
            )
        )
    }

    container.addSeparatorComponents(
        new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large, divider: true })
    )

    for (const player of battle.players) {
        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: `**${player.nome}**\n❤️ \`${barraDeVida(player.hp, player.maxHp)}\`\n`
            })
        )
    }

    container.addSeparatorComponents(
        new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large })
    )

    const current = getCurrentTurn(battle)

    container.addTextDisplayComponents(
        new TextDisplayBuilder({
            content: `> ${text}\n🎯 Turno: **${current.nome}**`
        })
    )

    container.addActionRowComponents(battle.row)

    return container
}

function calcDamage(attacker, target) {
    const atk = attacker.attack || attacker.ataque
    const def = target.defense || target.defesa
    return Math.max(0, Math.floor(atk - def + Math.random() * 5))
}

function checkBattleEnd(battle) {
    if (!battle.players.some(p => p.hp > 0)) return 'derrota'
    if (!battle.enemies.some(e => e.hp > 0)) return 'vitoria'
    return null
}

async function performAttack(battle, attacker) {
    const targets = attacker.tipo === 'player'
        ? battle.enemies.filter(e => e.hp > 0)
        : battle.players.filter(p => p.hp > 0)

    if (targets.length === 0) {
        return { text: 'Sem alvos disponíveis', result: checkBattleEnd(battle) }
    }

    const target = targets[Math.floor(Math.random() * targets.length)]

    const damage = calcDamage(attacker, target)

    target.hp -= damage
    if (target.hp <= 0) {
        target.hp = 0
        target.alive = false
    }

    const result = checkBattleEnd(battle)

    return {
        text: `${attacker.nome} causou ${damage} em ${target.nome}`,
        result
    }
}

// =========================
// TURN FLOW
// =========================

async function processTurn(battle) {
    if (!battle || battle.state !== 'active') return

    const current = getCurrentTurn(battle)

    const end = checkBattleEnd(battle)
    if (end) return rewardsAndEnd(battle, end)

    if (!current || !current.alive) {
        nextTurn(battle)
        return processTurn(battle)
    }

    if (current.tipo === 'player') {
        await updateBattleMessage(battle, 'Sua vez!')
        return
    }

    const attackResult = await performAttack(battle, current)

    await updateBattleMessage(battle, attackResult.text)

    if (attackResult.result) {
        return rewardsAndEnd(battle, attackResult.result)
    }

    nextTurn(battle)

    const next = getCurrentTurn(battle)

    if (next && next.tipo === 'enemy') {
        setTimeout(() => processTurn(battle), 800)
    } else {
        await updateBattleMessage(battle, 'Sua vez!')
    }
}

// =========================
// UPDATE
// =========================

async function updateBattleMessage(battle, text) {
    await battle.message.edit({
        components: [renderBattleContainer(battle, text)],
        flags: [MessageFlags.IsComponentsV2]
    })
}

// =========================
// RECOMPENSAS
// =========================

function calcularRecompensas(battle, result) {
    const totalXp = battle.enemies.reduce((a, e) => a + (e.xp || 0), 0)
    const totalMoeda = battle.enemies.reduce((a, e) => a + (e.moeda || 0), 0)

    let xp = totalXp
    let moeda = totalMoeda

    if (result === 'fuga') {
        xp *= 0.25
        moeda = 0
    }

    if (result === 'derrota') {
        xp *= 0.15
        moeda = 0
    }

    return {
        xp: Math.floor(xp),
        moeda: Math.floor(moeda)
    }
}

// =========================
// END
// =========================

async function rewardsAndEnd(battle, result) {
    const rewards = calcularRecompensas(battle, result)

    removeBattle(battle)

    rpgEvents.emit('battleEnd', {
        batalha: battle,
        result,
        rewards
    })
}

// =========================
// EXPORTS
// =========================

module.exports = {
    começarBatalha,
    updateBattleMessage,
    rewardsAndEnd,
    getBattleByUser,
    getBattleById,
    getCurrentTurn,
    nextTurn,
    processTurn,
    performAttack
}