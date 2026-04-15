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
const { randomUUID } = require('crypto')
const { obterUnicoItem } = require('../Utils/itensInventario')
const { obterUnicoInimigo } = require('../Utils/getInimigo')
const { criarEmbed } = require('../Utils/embedFactory')
const rpgEvents = require('../Events/rpgEvents')

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

function calcularForcaPlayer(player) {
    return player.nivel * 10 + player.attack * 2 + player.defense
}

function definirQuantidadeInimigos(player) {
    if (player.nivel < 15) return 1
    if (player.nivel < 20) return Math.random() < 0.7 ? 1 : 2
    if (player.nivel < 30) return Math.random() < 0.5 ? 2 : 3
    return 2 + Math.floor(Math.random() * 2)
}

function buildCombatPlayer(user, playerData, equips, team) {
    const { arma, armadura, calca } = equips

    return {
        id: user.id,
        nome: playerData.nome,
        tipo: 'player',
        team,
        nivel: playerData.level,
        maxHp: playerData.hp + (armadura?.heal ?? 0) + (calca?.heal ?? 0),
        hp: playerData.hp + (armadura?.heal ?? 0) + (calca?.heal ?? 0),
        attack: playerData.attack + (arma?.ataque ?? 0),
        defense: playerData.defense + (armadura?.defesa ?? 0) + (calca?.defesa ?? 0),
        speed: Math.floor(Math.random() * 10) + 1,
        isHuman: true,
        alive: true
    }
}

function criarInimigo(nivelPlayer, enemyData) {
    const scale = 0.8 + Math.random() * 1.2
    const level = Math.max(1, Math.round(nivelPlayer * scale))

    return {
        id: `enemy_${Date.now()}_${Math.random()}`,
        nome: enemyData.nome,
        tipo: 'enemy',
        team: 'enemies',
        level,
        maxHp: enemyData.vida + level * 5,
        hp: enemyData.vida + level * 5,
        ataque: enemyData.ataque + level * 2,
        defesa: enemyData.defesa + level,
        moeda: Math.round(Math.random() * 100) + level * 2,
        xp: Math.round(Math.random() * 100) + level * 10,
        imagem: enemyData.imagem || null,
        speed: Math.floor(Math.random() * 10) + 1,
        isHuman: false,
        alive: true
    }
}

function gerarInimigosBalanceados(player, enemiesDataList) {
    const quantidade = definirQuantidadeInimigos(player)
    const forcaTotal = calcularForcaPlayer(player) * 0.9
    const forcaPorInimigo = forcaTotal / quantidade
    const enemies = []

    for (let i = 0; i < quantidade; i++) {
        const base = enemiesDataList[Math.floor(Math.random() * enemiesDataList.length)]
        const enemy = criarInimigo(player.nivel, base)
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

function generateTurnOrder(battle) {
    return [...battle.players, ...battle.enemies].sort((a, b) => b.speed - a.speed)
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
    } while (!battle.turnOrder[battle.turnIndex]?.alive)
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
                description: `${targetUser}, ${challengerUser} desafiou você para uma batalha PvP!.\nVocê tem 1 minuto para responder.`,
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
            embeds: [criarEmbed({ description: 'Voce ja esta em batalha!', color: 'Orange' })]
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
        new ButtonBuilder().setCustomId(`rpg:run:${player.id}:${battleId}`).setLabel(mode === 'pvp' ? 'Desistir' : 'Fugir').setStyle(ButtonStyle.Secondary)
    )

    const startText = mode === 'pvp'
        ? `Batalha entre ${player.nome} e ${enemies[0].nome} começou!`
        : 'Batalha começou!'

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

function calcDamage(attacker, target) {
    const atk = attacker.attack || attacker.ataque || 0
    const def = target.defense || target.defesa || 0
    return Math.max(0, Math.floor(atk - def + Math.random() * 5))
}

function checkBattleEnd(battle) {
    if (!battle.players.some(player => player.hp > 0)) return 'derrota'
    if (!battle.enemies.some(enemy => enemy.hp > 0)) return 'vitoria'
    return null
}

function getTargetsFor(attacker, battle) {
    return attacker.team === 'players'
        ? battle.enemies.filter(target => target.hp > 0)
        : battle.players.filter(target => target.hp > 0)
}

async function performAttack(battle, attacker) {
    const targets = getTargetsFor(attacker, battle)

    if (targets.length === 0) {
        return { text: 'Sem alvos disponiveis', result: checkBattleEnd(battle) }
    }

    const target = targets[Math.floor(Math.random() * targets.length)]
    const damage = calcDamage(attacker, target)

    target.hp -= damage
    if (target.hp <= 0) {
        target.hp = 0
        target.alive = false
    }

    return {
        text: `${attacker.nome} causou ${damage} em ${target.nome}`,
        result: checkBattleEnd(battle)
    }
}

async function updateBattleMessage(battle, text) {
    await battle.message.edit({
        components: [renderBattleContainer(battle, text)],
        flags: [MessageFlags.IsComponentsV2]
    })
}

function calcularRecompensas(battle, result) {
    if (battle.mode === 'pvp') {
        return { xp: 10000, moeda: 0 }
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

    if (current.isHuman) {
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
