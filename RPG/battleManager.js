const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags
} = require('discord.js')
const { randomUUID } = require('crypto')
const { obterUnicoItem } = require('../Utils/itensInventario')
const { obterUnicoInimigo } = require('../Utils/getInimigo')
const { criarEmbed } = require('../Utils/embedFactory')
const rpgEvents = require('../Events/rpgEvents')
const {
    gerarInimigosBalanceados,
    generateTurnOrder,
    getCurrentTurn,
    nextTurn,
    performAttack,
    checkBattleEnd
} = require('./engine')
const {
    buildChallengeContainer,
    finalizeChallengeMessage,
    renderBattleContainer,
    updateBattleMessage
} = require('./render')

const batalhaCache = new Map()
const playerBattleIndex = new Map()
const desafioCache = new Map()
const playerChallengeIndex = new Map()

function createBattleId() {
    return randomUUID()
}

function createChallengeId() {
    return randomUUID()
}

function buildCombatPlayer(user, playerData, equips, team) {
    const { arma, armadura, calca } = equips

    return {
        id: user.id,
        nome: playerData.nome,
        tipo: 'player',
        team,
        nivel: playerData.level,
        mana: 100 + (armadura?.mana ?? 0) + (calca?.mana ?? 0),
        maxMana: 100 + (armadura?.mana ?? 0) + (calca?.mana ?? 0),
        maxHp: playerData.hp + (armadura?.heal ?? 0) + (calca?.heal ?? 0),
        hp: playerData.hp + (armadura?.heal ?? 0) + (calca?.heal ?? 0),
        attack: playerData.attack + (arma?.ataque ?? 0),
        defense: playerData.defense + (armadura?.defesa ?? 0) + (calca?.defesa ?? 0),
        speed: Math.floor(Math.random() * 10) + 1,
        isHuman: true,
        alive: true,
        effects: []
    }
}

function applyStartOfTurnEffects(battle, current) {
    if (!current.effects || current.effects.length === 0) return { skipped: false, texts: [] }

    const texts = []

    
    for (let i = current.effects.length - 1; i >= 0; i--) {
        const ef = current.effects[i]

        if (ef.type === 'DOT') {
            const dmg = ef.damagePerTurn || 1
            current.hp -= dmg
            texts.push(`💥 ${current.nome} sofre ${dmg} de dano por efeito (${ef.sourceName || 'efeito'})`)
            ef.remainingTurns = (ef.remainingTurns || 1) - 1
            if (current.hp <= 0) {
                current.hp = 0
                current.alive = false
            }
            if (ef.remainingTurns <= 0) {
                current.effects.splice(i, 1)
            }
        }

        if (ef.type === 'SKIP') {
            // if skip has remaining turns, decrement and skip this turn
            if ((ef.remainingTurns || 1) > 0) {
                ef.remainingTurns = ef.remainingTurns - 1
                texts.push(`⏭️ ${current.nome} perdeu o turno por efeito (${ef.sourceName || 'efeito'})`)
                if (ef.remainingTurns <= 0) {
                    current.effects.splice(i, 1)
                }
                return { skipped: true, texts }
            }
        }
    }

    return { skipped: false, texts }
}

function getBattleByUser(userId) {
    const battleId = playerBattleIndex.get(userId)
    if (!battleId) return null
    return batalhaCache.get(battleId)
}

function getBattleById(battleId) {
    return batalhaCache.get(battleId)
}

function getChallengeById(challengeId) {
    return desafioCache.get(challengeId)
}

function getChallengeByUser(userId) {
    const challengeId = playerChallengeIndex.get(userId)
    if (!challengeId) return null
    return desafioCache.get(challengeId)
}

function removeBattle(battle) {
    batalhaCache.delete(battle.id)
    for (const participant of [...battle.players, ...battle.enemies]) {
        if (participant.isHuman) {
            playerBattleIndex.delete(participant.id)
        }
    }
}

function removeChallenge(challenge) {
    if (!challenge) return

    if (challenge.timeoutHandle) {
        clearTimeout(challenge.timeoutHandle)
    }

    desafioCache.delete(challenge.id)
    playerChallengeIndex.delete(challenge.challengerUser.id)
    playerChallengeIndex.delete(challenge.targetUser.id)
}

async function carregarEquipamentos(playerData) {
    const [armadura, arma, calca] = await Promise.all([
        obterUnicoItem(playerData.armaduraID),
        obterUnicoItem(playerData.armaID),
        obterUnicoItem(playerData.calcaID)
    ])

    return { arma, armadura, calca }
}

async function createPvpChallenge({ channel, challengerUser, targetUser, timeoutMs = 60000 }) {
    if (getBattleByUser(challengerUser.id) || getBattleByUser(targetUser.id)) {
        return channel.send({
            embeds: [criarEmbed({ description: 'Um dos jogadores já está em batalha.', color: 'Orange' })]
        })
    }

    if (getChallengeByUser(challengerUser.id) || getChallengeByUser(targetUser.id)) {
        return channel.send({
            embeds: [criarEmbed({ description: 'Já existe um desafio pendente para um desses jogadores.', color: 'Orange' })]
        })
    }

    const challenge = {
        id: createChallengeId(),
        challengerUser,
        targetUser,
        channel,
        message: null,
        timeoutHandle: null,
        createdAt: Date.now()
    }

    const message = await channel.send({
        components: [
            buildChallengeContainer({
                title: 'Desafio PvP',
                description: `${targetUser}, ${challengerUser} desafiou você a para uma batalha PvP!.\n Você tem 1 minuto para responder.`,
                challengeId: challenge.id,
                targetUserId: targetUser.id,
                accentColor: 0x8b1e3f
            })
        ],
        flags: [MessageFlags.IsComponentsV2]
    })

    challenge.message = message
    challenge.timeoutHandle = setTimeout(async () => {
        const activeChallenge = getChallengeById(challenge.id)
        if (!activeChallenge) return

        await finalizeChallengeMessage(
            activeChallenge,
            `${targetUser}, o desafio de ${challengerUser} expirou sem resposta.`
        )

        removeChallenge(activeChallenge)
    }, timeoutMs)

    desafioCache.set(challenge.id, challenge)
    playerChallengeIndex.set(challengerUser.id, challenge.id)
    playerChallengeIndex.set(targetUser.id, challenge.id)

    return challenge
}

async function comecarBatalha({ interaction, playerData, channel, targetUser = null, targetPlayerData = null, initiatorUser = interaction?.user }) {
    if (getBattleByUser(initiatorUser.id)) {
        return channel.send({
            embeds: [criarEmbed({ description: 'Você já está em batalha!', color: 'Orange' })]
        })
    }

    if (targetUser && getBattleByUser(targetUser.id)) {
        return channel.send({
            embeds: [criarEmbed({ description: 'Esse usuario ja esta em batalha!', color: 'Orange' })]
        })
    }

    const player = buildCombatPlayer(
        initiatorUser,
        playerData,
        await carregarEquipamentos(playerData),
        'players'
    )

    let enemies = []
    let mode = 'pve'

    if (targetUser && targetPlayerData) {
        enemies = [
            buildCombatPlayer(
                targetUser,
                targetPlayerData,
                await carregarEquipamentos(targetPlayerData),
                'enemies'
            )
        ]
        mode = 'pvp'
    } else {
        const enemiesDataList = [
            await obterUnicoInimigo(1),
            await obterUnicoInimigo(2),
            await obterUnicoInimigo(3)
        ].filter(Boolean)

        enemies = gerarInimigosBalanceados(player, enemiesDataList)
    }

    const battleId = createBattleId()
    const battle = {
        id: battleId,
        mode,
        players: [player],
        enemies,
        turnIndex: 0,
        turnOrder: [],
        channel,
        message: null,
        processing: false,
        state: 'active',
        timeoutHandle: null,
        user: initiatorUser
    }

    battle.turnOrder = generateTurnOrder(battle)
    battle.row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`rpg:attack:${player.id}:${battleId}`).setLabel('Ataque').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(`rpg:heal:${player.id}:${battleId}`).setLabel('Curar').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`rpg:magia:${player.id}:${battleId}`).setLabel('Magia').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`rpg:run:${player.id}:${battleId}`).setLabel(mode === 'pvp' ? 'Desistir' : 'Fugir').setStyle(ButtonStyle.Secondary)
    )

    const startText = mode === 'pvp'
        ? `Batalha entre ${player.nome} X ${enemies[0].nome} começou!`
        : 'Batalha Começou!'

    const msg = await channel.send({
        components: [renderBattleContainer(battle, startText)],
        flags: [MessageFlags.IsComponentsV2]
    })

    battle.message = msg
    batalhaCache.set(battleId, battle)
    playerBattleIndex.set(player.id, battleId)

    for (const enemy of enemies) {
        if (enemy.isHuman) {
            playerBattleIndex.set(enemy.id, battleId)
        }
    }

    const current = getCurrentTurn(battle)
    if (current && !current.isHuman) {
        setTimeout(() => processTurn(battle), 1000)
    }

    return battle
}

function calcularRecompensas(battle, result) {
    if (battle.mode === 'pvp') {
        return { xp: 5000, moeda: 0 }
    }

    const totalXp = battle.enemies.reduce((total, enemy) => total + (enemy.xp || 0), 0)
    const totalMoeda = battle.enemies.reduce((total, enemy) => total + (enemy.moeda || 0), 0)

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

async function rewardsAndEnd(battle, result) {
    const rewards = calcularRecompensas(battle, result)
    removeBattle(battle)

    rpgEvents.emit('battleEnd', {
        batalha: battle,
        result,
        rewards
    })
}

async function processTurn(battle) {
    if (!battle || battle.state !== 'active') return

    const end = checkBattleEnd(battle)
    if (end) return rewardsAndEnd(battle, end)

    const current = getCurrentTurn(battle)
    if (!current || !current.alive) {
        nextTurn(battle)
        return processTurn(battle)
    }


    const effectResult = applyStartOfTurnEffects(battle, current)
    if (effectResult.texts && effectResult.texts.length > 0) {
        await updateBattleMessage(battle, effectResult.texts.join('\n'), 2000)
    }

    if (effectResult.skipped) {
        // if skipped by effect, advance to next turn
        if (checkBattleEnd(battle)) return rewardsAndEnd(battle, checkBattleEnd(battle))
        nextTurn(battle)
        return processTurn(battle)
    }

    if (current.isHuman) {
        await updateBattleMessage(battle, 'Sua vez!')
        return
    }

    const attackResult = await performAttack(battle, current)
    await updateBattleMessage(battle, attackResult.text, 5000)

    if (attackResult.result) {
        return rewardsAndEnd(battle, attackResult.result)
    }

    nextTurn(battle)
    const next = getCurrentTurn(battle)

    if (next && !next.isHuman) {
        setTimeout(() => processTurn(battle), 800)
    } else {
        await updateBattleMessage(battle, 'Sua vez!')
    }
}

module.exports = {
    comecarBatalha,
    createPvpChallenge,
    'começarBatalha': comecarBatalha,
    updateBattleMessage,
    rewardsAndEnd,
    getBattleByUser,
    getBattleById,
    getChallengeById,
    getChallengeByUser,
    removeChallenge,
    finalizeChallengeMessage,
    getCurrentTurn,
    nextTurn,
    processTurn,
    performAttack,
    checkBattleEnd
}
