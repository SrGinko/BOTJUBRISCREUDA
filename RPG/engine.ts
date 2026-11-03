import type { Battle, BattleResult, Combatant, EnemyData, RpgItem, StatusEffect } from '../types/RPG'

const STATUS_EMOJI: Record<string, string> = {
    Burn: '🔥',
    Elec: '⚡',
    Ice: '❄️',
    Curse: '☠️',
}

function normalizeStatusName(statusName: unknown): keyof typeof STATUS_EMOJI | null {
    const normalized = String(statusName ?? '').trim().toLowerCase()
    switch (normalized) {
        case 'burn': return 'Burn'
        case 'elec':
        case 'elct':
        case 'elect':
        case 'electric': return 'Elec'
        case 'ice': return 'Ice'
        case 'curse': return 'Curse'
        default: return null
    }
}

function getStatusEmoji(statusName: unknown): string {
    const normalized = normalizeStatusName(statusName)
    return normalized ? STATUS_EMOJI[normalized] : ''
}

export function tryApplyStatusEffect(item: RpgItem | null | undefined, target: Combatant): {
    statusName: string
    statusEmoji: string
    damagePerTurn: number
    duration: number
    effectObj: StatusEffect
    appliedStatusText: string
} | null {
    const chance = Number(item?.chanceStatus ?? 0) / 100
    if (!chance || Math.random() >= chance) return null

    const statusName = normalizeStatusName(item?.statusName ?? item?.statusNome ?? item?.status)
    if (!statusName) return null

    const duration = Math.max(1, Number(
        item?.statusDuration ?? item?.statusTurns ?? item?.statusTurnos ?? item?.turns ?? item?.duration ??
        (Math.floor(Math.random() * 4) + 2),
    ))
    const damagePerTurn = Math.max(1, Number(
        item?.statusDamage ?? item?.statusDamagePerTurn ?? item?.statusAtaque ?? Math.floor((target.maxHp || 1) * 0.05),
    ))
    const statusEmoji = getStatusEmoji(statusName)
    const effectObj: StatusEffect = {
        type: 'DOT',
        damagePerTurn,
        remainingTurns: duration,
        sourceName: `${statusName} ${statusEmoji}`.trim(),
    }

    target.effects.push(effectObj)
    return {
        statusName,
        statusEmoji,
        damagePerTurn,
        duration,
        effectObj,
        appliedStatusText: ` e aplicou ${statusName} ${statusEmoji} (${damagePerTurn} por ${duration} turnos)`,
    }
}

function calcularForcaPlayer(player: Combatant): number {
    return (player.nivel ?? player.level ?? 1) * 10 + (player.attack ?? player.ataque ?? 0) * 2 + (player.defense ?? player.defesa ?? 0)
}

function definirQuantidadeInimigos(player: Combatant): number {
    const level = player.nivel ?? player.level ?? 1
    if (level < 15) return 1
    if (level < 20) return Math.random() < 0.7 ? 1 : 2
    if (level < 30) return Math.random() < 0.5 ? 2 : 3
    return 2 + Math.floor(Math.random() * 2)
}

function criarInimigo(nivelPlayer: number, enemyData: EnemyData): Combatant {
    const minLevel = Math.max(1, Math.floor(nivelPlayer * 0.9))
    const maxLevel = Math.ceil(nivelPlayer * 1.1)
    const level = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel
    const hp = enemyData.vida + level * 5

    return {
        id: `enemy_${Date.now()}_${Math.random()}`,
        nome: enemyData.nome,
        tipo: 'enemy',
        team: 'enemies',
        level,
        maxHp: hp,
        hp,
        ataque: enemyData.ataque + level * 2,
        defesa: enemyData.defesa + level,
        moeda: Math.round(Math.random() * 100) + level * 2,
        xp: Math.round(Math.random() * 100) + level * 10,
        imagem: enemyData.imagem ?? null,
        speed: Math.floor(Math.random() * 10) + 1,
        mana: 0,
        isHuman: false,
        alive: true,
        effects: [],
    }
}

function calcularForcaInimigo(enemy: Combatant): number {
    return (enemy.ataque ?? enemy.attack ?? 0) * 2 + (enemy.defesa ?? enemy.defense ?? 0) * 1.5 + enemy.maxHp / 4
}

export function gerarInimigosBalanceados(player: Combatant, enemiesDataList: EnemyData[]): Combatant[] {
    if (enemiesDataList.length === 0) return []

    const quantity = definirQuantidadeInimigos(player)
    const desiredStrength = calcularForcaPlayer(player) * 1.1
    const playerLevel = player.nivel ?? player.level ?? 1
    const enemies = Array.from({ length: quantity }, () => {
        const base = enemiesDataList[Math.floor(Math.random() * enemiesDataList.length)]
        return criarInimigo(playerLevel, base)
    })
    const currentStrength = enemies.reduce((total, enemy) => total + calcularForcaInimigo(enemy), 0)
    const scale = Math.min(Math.max(desiredStrength / currentStrength, 0.7), 1.5)

    for (const enemy of enemies) {
        enemy.ataque = Math.max(1, Math.round((enemy.ataque ?? 0) * scale))
        enemy.defesa = Math.max(1, Math.round((enemy.defesa ?? 0) * scale))
        enemy.maxHp = Math.max(10, Math.round(enemy.maxHp * scale))
        enemy.hp = enemy.maxHp
    }
    return enemies
}

export function generateTurnOrder(battle: Pick<Battle, 'players' | 'enemies'>): Combatant[] {
    return [...battle.players, ...battle.enemies].sort((a, b) => b.speed - a.speed)
}

export function getCurrentTurn(battle: Battle): Combatant | undefined {
    return battle.turnOrder[battle.turnIndex]
}

export function nextTurn(battle: Battle): void {
    for (const participant of [...battle.players, ...battle.enemies]) {
        if (participant.alive) participant.mana = Math.min(participant.mana + 2, participant.maxMana || 100)
    }

    let attempts = 0
    do {
        battle.turnIndex = (battle.turnIndex + 1) % battle.turnOrder.length
        attempts++
        if (attempts > battle.turnOrder.length) break
    } while (!battle.turnOrder[battle.turnIndex]?.alive)
}

function calcDamage(attacker: Combatant, target: Combatant): number {
    const attack = attacker.attack ?? attacker.ataque ?? 0
    const defense = target.defense ?? target.defesa ?? 0
    return Math.max(0, Math.floor(attack - defense + Math.random() * 5))
}

export function checkBattleEnd(battle: Battle): BattleResult | null {
    if (!battle.players.some(player => player.hp > 0)) return 'derrota'
    if (!battle.enemies.some(enemy => enemy.hp > 0)) return 'vitoria'
    return null
}

function getTargetsFor(attacker: Combatant, battle: Battle): Combatant[] {
    return attacker.team === 'players'
        ? battle.enemies.filter(target => target.hp > 0)
        : battle.players.filter(target => target.hp > 0)
}

export async function performAttack(battle: Battle, attacker: Combatant): Promise<{ text: string; result: BattleResult | null }> {
    const targets = getTargetsFor(attacker, battle)
    if (targets.length === 0) return { text: 'Sem alvos disponíveis', result: checkBattleEnd(battle) }

    const target = targets[Math.floor(Math.random() * targets.length)]
    const damageBase = calcDamage(attacker, target)
    const damage = attacker.isHuman ? Math.max(1, damageBase) : damageBase
    target.hp -= damage
    if (target.hp <= 0) {
        target.hp = 0
        target.alive = false
    }

    const statusEffect = target.alive ? tryApplyStatusEffect(attacker.arma, target) : null
    return {
        text: `${attacker.nome} causou ${damage} em ${target.nome}${statusEffect?.appliedStatusText ?? ''}`,
        result: checkBattleEnd(battle),
    }
}
