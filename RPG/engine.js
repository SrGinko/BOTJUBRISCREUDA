function calcularForcaPlayer(player) {
    return player.nivel * 10 + player.attack * 2 + player.defense
}

function definirQuantidadeInimigos(player) {
    if (player.nivel < 15) return 1
    if (player.nivel < 20) return Math.random() < 0.7 ? 1 : 2
    if (player.nivel < 30) return Math.random() < 0.5 ? 2 : 3
    return 2 + Math.floor(Math.random() * 2)
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

module.exports = {
    gerarInimigosBalanceados,
    generateTurnOrder,
    getCurrentTurn,
    nextTurn,
    performAttack,
    checkBattleEnd
}
