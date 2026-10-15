import { randomUUID } from 'node:crypto'
import {
    MessageFlags,
    type ButtonInteraction,
    type ChatInputCommandInteraction,
    type SendableChannels,
    type User,
} from 'discord.js'
import { BuscarItemPorTipo, obterUnicoItem } from '../service/itensInventario'
import { obterUnicoInimigo } from '../service/getInimigo'
import { criarEmbed } from '../Utils/embedFactory'
import rpgEvents from '../Events/rpgEvents'
import type { Battle, BattleMode, BattleResult, BattleRewards, ChestReward, Combatant, EnemyData, HeroData, PvpChallenge, RpgItem } from '../types/RPG'
import {
    checkBattleEnd,
    generateTurnOrder,
    gerarInimigosBalanceados,
    getCurrentTurn,
    nextTurn,
    performAttack,
} from './engine'
import {
    buildChallengeContainer,
    createBattleActionRow,
    finalizeChallengeMessage,
    renderBattleContainer,
    updateBattleMessage,
} from './render'

const battles = new Map<string, Battle>()
const battleIdByPlayer = new Map<string, string>()
const challenges = new Map<string, PvpChallenge>()
const challengeIdByPlayer = new Map<string, string>()

const CHEST_CHANCES = { COMUM: 35, RARO: 10 } as const
const CHEST_LOOT_TABLE = {
    COMUM: ['COMUM', 'RARA'],
    RARA: ['COMUM', 'RARA', 'EPICO'],
} as const
const CHEST_CONFIG = { COMUM: { maxRewards: 2 }, RARA: { maxRewards: 4 } } as const

interface CreatePvpChallengeOptions {
    channel: SendableChannels
    challengerUser: User
    targetUser: User
    timeoutMs?: number
}

interface StartBattleOptions {
    interaction?: Pick<ChatInputCommandInteraction | ButtonInteraction, 'user'>
    playerData: HeroData
    channel: SendableChannels
    targetUser?: User | null
    targetPlayerData?: HeroData | null
    initiatorUser?: User
}

function getBattleByUser(userId: string): Battle | null {
    const battleId = battleIdByPlayer.get(userId)
    return battleId ? battles.get(battleId) ?? null : null
}

function getBattleById(battleId: string | undefined): Battle | null {
    return battleId ? battles.get(battleId) ?? null : null
}

function getChallengeById(challengeId: string): PvpChallenge | null {
    return challenges.get(challengeId) ?? null
}

function getChallengeByUser(userId: string): PvpChallenge | null {
    const challengeId = challengeIdByPlayer.get(userId)
    return challengeId ? challenges.get(challengeId) ?? null : null
}

function removeBattle(battle: Battle): void {
    battles.delete(battle.id)
    battle.state = 'finished'
    for (const participant of [...battle.players, ...battle.enemies]) {
        if (participant.isHuman) battleIdByPlayer.delete(participant.id)
    }
}

function removeChallenge(challenge: PvpChallenge | null): void {
    if (!challenge) return
    if (challenge.timeoutHandle) clearTimeout(challenge.timeoutHandle)
    challenges.delete(challenge.id)
    challengeIdByPlayer.delete(challenge.challengerUser.id)
    challengeIdByPlayer.delete(challenge.targetUser.id)
}

async function carregarEquipamentos(playerData: HeroData): Promise<{
    arma: RpgItem | null
    armadura: RpgItem | null
    calca: RpgItem | null
}> {
    const [armadura, arma, calca] = await Promise.all([
        playerData.armaduraID ? obterUnicoItem(playerData.armaduraID) : null,
        playerData.armaID ? obterUnicoItem(playerData.armaID) : null,
        playerData.calcaID ? obterUnicoItem(playerData.calcaID) : null,
    ])
    return { arma, armadura, calca }
}

function buildCombatPlayer(user: User, playerData: HeroData, equips: Awaited<ReturnType<typeof carregarEquipamentos>>, team: Combatant['team']): Combatant {
    const { arma, armadura, calca } = equips
    const maxMana = 100 + (armadura?.mana ?? 0) + (calca?.mana ?? 0)
    const maxHp = playerData.hp + (armadura?.heal ?? 0) + (calca?.heal ?? 0)
    return {
        id: user.id,
        nome: playerData.nome,
        tipo: 'player',
        team,
        nivel: playerData.level,
        mana: maxMana,
        maxMana,
        maxHp,
        hp: maxHp,
        attack: playerData.attack + (arma?.ataque ?? 0),
        defense: playerData.defense + (armadura?.defesa ?? 0) + (calca?.defesa ?? 0),
        speed: Math.floor(Math.random() * 10) + 1,
        isHuman: true,
        alive: true,
        effects: [],
        arma,
    }
}

function gerarBau(): ChestReward['tipo'] | null {
    const roll = Math.random() * 100
    if (roll <= CHEST_CHANCES.RARO) return 'RARA'
    if (roll <= CHEST_CHANCES.RARO + CHEST_CHANCES.COMUM) return 'COMUM'
    return null
}

async function gerarConteudoBau(tipoBau: ChestReward['tipo']): Promise<ChestReward['conteudo']> {
    const rewards: ChestReward['conteudo'] = []
    const quantity = CHEST_CONFIG[tipoBau].maxRewards + 1
    const allowedRarities = CHEST_LOOT_TABLE[tipoBau]

    for (let index = 0; index < quantity; index++) {
        const rewardType = Math.floor(Math.random() * 3)
        if (rewardType === 0) {
            const rarity = allowedRarities[Math.floor(Math.random() * allowedRarities.length)]
            const items = await BuscarItemPorTipo(rarity)
            if (items.length) {
                rewards.push({
                    tipo: 'ITEM',
                    item: items[Math.floor(Math.random() * items.length)],
                    quantidade: Math.floor(Math.random() * 3) + 1,
                })
            }
        } else {
            const currencyType = rewardType === 1 ? 'MOEDA' : 'XP'
            rewards.push({
                tipo: currencyType,
                quantidade: currencyType === 'MOEDA'
                    ? Math.floor(Math.random() * 500) + 100
                    : Math.floor(Math.random() * 300) + 50,
            })
        }
    }
    return rewards
}

export async function createPvpChallenge({ channel, challengerUser, targetUser, timeoutMs = 60_000 }: CreatePvpChallengeOptions): Promise<PvpChallenge | null> {
    if (getBattleByUser(challengerUser.id) || getBattleByUser(targetUser.id)) {
        await channel.send({ embeds: [criarEmbed({ description: 'Um dos jogadores já está em batalha.', color: 'Orange' })] })
        return null
    }
    if (getChallengeByUser(challengerUser.id) || getChallengeByUser(targetUser.id)) {
        await channel.send({ embeds: [criarEmbed({ description: 'Já existe um desafio pendente para um desses jogadores.', color: 'Orange' })] })
        return null
    }

    const challenge: PvpChallenge = {
        id: randomUUID(),
        challengerUser,
        targetUser,
        channel,
        message: null,
        timeoutHandle: null,
        createdAt: Date.now(),
    }
    challenge.message = await channel.send({
        components: [buildChallengeContainer({
            title: 'Desafio PvP',
            description: `${targetUser}, ${challengerUser} desafiou você para uma batalha PvP! Você tem 1 minuto para responder.`,
            challengeId: challenge.id,
            targetUserId: targetUser.id,
            accentColor: 0x8b1e3f,
        })],
        flags: [MessageFlags.IsComponentsV2],
    })

    challenge.timeoutHandle = setTimeout(async () => {
        const activeChallenge = getChallengeById(challenge.id)
        if (!activeChallenge) return
        await finalizeChallengeMessage(activeChallenge, `${targetUser}, o desafio de ${challengerUser} expirou sem resposta.`)
        removeChallenge(activeChallenge)
    }, timeoutMs)

    challenges.set(challenge.id, challenge)
    challengeIdByPlayer.set(challengerUser.id, challenge.id)
    challengeIdByPlayer.set(targetUser.id, challenge.id)
    return challenge
}

export async function comecarBatalha(options: StartBattleOptions): Promise<Battle | null> {
    const initiatorUser = options.initiatorUser ?? options.interaction?.user
    if (!initiatorUser) throw new Error('O usuário que inicia a batalha precisa ser informado.')
    const { playerData, channel, targetUser, targetPlayerData } = options

    if (getBattleByUser(initiatorUser.id)) {
        await channel.send({ embeds: [criarEmbed({ description: 'Você já está em batalha!', color: 'Orange' })] })
        return null
    }
    if (targetUser && getBattleByUser(targetUser.id)) {
        await channel.send({ embeds: [criarEmbed({ description: 'Esse usuário já está em batalha!', color: 'Orange' })] })
        return null
    }

    const player = buildCombatPlayer(initiatorUser, playerData, await carregarEquipamentos(playerData), 'players')
    let enemies: Combatant[]
    let mode: BattleMode
    if (targetUser && targetPlayerData) {
        enemies = [buildCombatPlayer(targetUser, targetPlayerData, await carregarEquipamentos(targetPlayerData), 'enemies')]
        mode = 'pvp'
    } else {
        const enemyData = (await Promise.all([
            obterUnicoInimigo(1), obterUnicoInimigo(2), obterUnicoInimigo(3),
        ])).filter((enemy): enemy is EnemyData => Boolean(enemy))
        if (!enemyData.length) throw new Error('Não foi possível carregar inimigos para iniciar a batalha.')
        enemies = gerarInimigosBalanceados(player, enemyData)
        mode = 'pve'
    }

    const battleId = randomUUID()
    const battle: Battle = {
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
        user: initiatorUser,
        row: createBattleActionRow(player.id, battleId, mode),
    }
    battle.turnOrder = generateTurnOrder(battle)

    const startText = mode === 'pvp' ? `Batalha entre ${player.nome} X ${enemies[0].nome} começou!` : 'Batalha começou!'
    battle.message = await channel.send({
        components: [renderBattleContainer(battle, startText)],
        flags: [MessageFlags.IsComponentsV2],
    })
    battles.set(battle.id, battle)
    battleIdByPlayer.set(player.id, battle.id)
    for (const enemy of enemies) if (enemy.isHuman) battleIdByPlayer.set(enemy.id, battle.id)

    const current = getCurrentTurn(battle)
    if (current && !current.isHuman) setTimeout(() => void processTurn(battle), 1_000)
    return battle
}

async function calcularRecompensas(battle: Battle, result: BattleResult): Promise<BattleRewards> {
    if (battle.mode === 'pvp') return { xp: Math.floor(Math.random() * 5_000), moeda: 0, baus: [] }

    const totalXp = battle.enemies.reduce((total, enemy) => total + (enemy.xp ?? 0), 0)
    const totalMoeda = battle.enemies.reduce((total, enemy) => total + (enemy.moeda ?? 0), 0)
    let xp = totalXp
    let moeda = totalMoeda
    if (result === 'fuga') { xp *= 0.25; moeda = 0 }
    if (result === 'derrota') { xp *= 0.15; moeda = 0 }

    const rewards: BattleRewards = { xp: Math.floor(xp), moeda: Math.floor(moeda), baus: [] }
    const chestType = gerarBau()
    if (chestType) rewards.baus.push({ tipo: chestType, conteudo: await gerarConteudoBau(chestType) })
    return rewards
}

export async function rewardsAndEnd(battle: Battle, result: BattleResult): Promise<void> {
    if (battle.state !== 'active') return
    const rewards = await calcularRecompensas(battle, result)
    removeBattle(battle)
    rpgEvents.emit('battleEnd', { batalha: battle, result, rewards })
}

function applyStartOfTurnEffects(current: Combatant): { skipped: boolean; texts: string[] } {
    const texts: string[] = []
    for (let index = current.effects.length - 1; index >= 0; index--) {
        const effect = current.effects[index]
        if (effect.type === 'DOT') {
            const damage = effect.damagePerTurn || 1
            current.hp -= damage
            texts.push(`💥 ${current.nome} sofre ${damage} de dano por efeito (${effect.sourceName || 'efeito'})`)
            effect.remainingTurns--
            if (current.hp <= 0) { current.hp = 0; current.alive = false }
            if (effect.remainingTurns <= 0) current.effects.splice(index, 1)
        }
        if (effect.type === 'SKIP' && effect.remainingTurns > 0) {
            effect.remainingTurns--
            texts.push(`⏭️ ${current.nome} perdeu o turno por efeito (${effect.sourceName || 'efeito'})`)
            if (effect.remainingTurns <= 0) current.effects.splice(index, 1)
            return { skipped: true, texts }
        }
    }
    return { skipped: false, texts }
}

export async function processTurn(battle: Battle): Promise<void> {
    if (battle.state !== 'active') return
    const end = checkBattleEnd(battle)
    if (end) { await rewardsAndEnd(battle, end); return }

    const current = getCurrentTurn(battle)
    if (!current || !current.alive) { nextTurn(battle); await processTurn(battle); return }

    const effectResult = applyStartOfTurnEffects(current)
    if (effectResult.texts.length) await updateBattleMessage(battle, effectResult.texts.join('\n'), 2_000)
    if (effectResult.skipped) {
        const result = checkBattleEnd(battle)
        if (result) { await rewardsAndEnd(battle, result); return }
        nextTurn(battle)
        await processTurn(battle)
        return
    }
    if (current.isHuman) { await updateBattleMessage(battle, 'Sua vez!'); return }

    const attackResult = await performAttack(battle, current)
    await updateBattleMessage(battle, attackResult.text, 2_000)
    if (attackResult.result) { await rewardsAndEnd(battle, attackResult.result); return }

    nextTurn(battle)
    const next = getCurrentTurn(battle)
    if (next && !next.isHuman) setTimeout(() => void processTurn(battle), 800)
    else await updateBattleMessage(battle, 'Sua vez!')
}

export {
    getBattleByUser,
    getBattleById,
    getChallengeById,
    getChallengeByUser,
    removeChallenge,
    finalizeChallengeMessage,
    getCurrentTurn,
    nextTurn,
    updateBattleMessage,
    checkBattleEnd,
    performAttack,
}
