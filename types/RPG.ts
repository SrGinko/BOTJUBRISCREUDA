import type {
    ActionRowBuilder,
    ButtonBuilder,
    Message,
    SendableChannels,
    User,
} from 'discord.js'
import type { Heroi } from './Heroi'

export type BattleMode = 'pve' | 'pvp'
export type BattleResult = 'vitoria' | 'derrota' | 'fuga' | 'timeout'
export type Team = 'players' | 'enemies'
export type StatusEffectType = 'DOT' | 'SKIP'

export interface RpgItem {
    id: number
    nome: string
    tipo: string
    raridade?: string
    descricao?: string
    preco?: number
    imagem?: string | null
    ataque?: number
    defesa?: number
    heal?: number
    mana?: number
    chanceStatus?: number
    statusName?: string
    statusNome?: string
    status?: string
    statusDuration?: number
    statusTurns?: number
    statusTurnos?: number
    turns?: number
    duration?: number
    statusDamage?: number
    statusDamagePerTurn?: number
    statusAtaque?: number
}

export interface InventoryEntry {
    item: RpgItem
    quantidade: number
}

export interface StatusEffect {
    type: StatusEffectType
    damagePerTurn?: number
    remainingTurns: number
    sourceName: string
}

export interface EnemyData {
    nome: string
    vida: number
    ataque: number
    defesa: number
    imagem?: string | null
}

export type HeroData = Heroi

export interface Combatant {
    id: string
    nome: string
    tipo: 'player' | 'enemy'
    team: Team
    nivel?: number
    level?: number
    maxHp: number
    hp: number
    attack?: number
    ataque?: number
    defense?: number
    defesa?: number
    maxMana?: number
    mana: number
    speed: number
    isHuman: boolean
    alive: boolean
    effects: StatusEffect[]
    arma?: RpgItem | null
    imagem?: string | null
    moeda?: number
    xp?: number
}

export interface Battle {
    id: string
    mode: BattleMode
    players: Combatant[]
    enemies: Combatant[]
    turnIndex: number
    turnOrder: Combatant[]
    channel: SendableChannels
    message: Message | null
    processing: boolean
    state: 'active' | 'finished'
    fledBy?: string
    timeoutHandle: NodeJS.Timeout | null
    user: User
    row: ActionRowBuilder<ButtonBuilder>
}

export interface PvpChallenge {
    id: string
    challengerUser: User
    targetUser: User
    channel: SendableChannels
    message: Message | null
    timeoutHandle: NodeJS.Timeout | null
    createdAt: number
}

export interface LootItemReward {
    tipo: 'ITEM'
    item: RpgItem
    quantidade: number
}

export interface LootCurrencyReward {
    tipo: 'MOEDA' | 'XP'
    quantidade: number
}

export type LootReward = LootItemReward | LootCurrencyReward

export interface ChestReward {
    tipo: 'COMUM' | 'RARA'
    conteudo: LootReward[]
}

export interface BattleRewards {
    xp: number
    moeda: number
    baus: ChestReward[]
}

export interface BattleEndPayload {
    batalha: Battle
    result: BattleResult
    rewards: BattleRewards
}
