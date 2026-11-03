import { BuscarItemPorTipo } from '../service/itensInventario'
import type { ChestReward, LootReward, RpgItem } from '../types/RPG'

type ChestType = ChestReward['tipo']
type ItemRarity = 'COMUM' | 'RARA' | 'EPICO' | 'LENDARIO'
type RewardType = 'ITEM' | 'MOEDA' | 'XP'

interface WeightedValue<T> {
	value: T
	weight: number
}

interface ChestConfig {
	minRewards: number
	maxRewards: number
	itemRarities: WeightedValue<ItemRarity>[]
	rewardTypes: WeightedValue<RewardType>[]
	itemQuantity: [number, number]
	moedas: [number, number]
	xp: [number, number]
}

const CHEST_DROP_CHANCES: WeightedValue<ChestType>[] = [
	{ value: 'LENDARIO', weight: 2 },
	{ value: 'RARA', weight: 8 },
	{ value: 'NORMAL', weight: 20 },
	{ value: 'COMUM', weight: 35 },
]

const CHEST_CONFIG: Record<ChestType, ChestConfig> = {
	COMUM: {
		minRewards: 1, maxRewards: 2,
		itemRarities: [{ value: 'COMUM', weight: 100 }],
		rewardTypes: [{ value: 'ITEM', weight: 45 }, { value: 'MOEDA', weight: 35 }, { value: 'XP', weight: 20 }],
		itemQuantity: [1, 2], moedas: [100, 300], xp: [50, 150],
	},
	NORMAL: {
		minRewards: 2, maxRewards: 3,
		itemRarities: [{ value: 'COMUM', weight: 70 }, { value: 'RARA', weight: 30 }],
		rewardTypes: [{ value: 'ITEM', weight: 55 }, { value: 'MOEDA', weight: 30 }, { value: 'XP', weight: 15 }],
		itemQuantity: [1, 2], moedas: [250, 600], xp: [150, 350],
	},
	RARA: {
		minRewards: 2, maxRewards: 4,
		itemRarities: [{ value: 'RARA', weight: 70 }, { value: 'EPICO', weight: 30 }],
		rewardTypes: [{ value: 'ITEM', weight: 65 }, { value: 'MOEDA', weight: 25 }, { value: 'XP', weight: 10 }],
		itemQuantity: [1, 2], moedas: [500, 1_200], xp: [300, 700],
	},
	LENDARIO: {
		minRewards: 3, maxRewards: 5,
		itemRarities: [{ value: 'EPICO', weight: 65 }, { value: 'LENDARIO', weight: 35 }],
		rewardTypes: [{ value: 'ITEM', weight: 75 }, { value: 'MOEDA', weight: 15 }, { value: 'XP', weight: 10 }],
		itemQuantity: [1, 3], moedas: [1_000, 2_500], xp: [600, 1_200],
	},
}

const ITEM_RARITY_FALLBACK: Record<ItemRarity, ItemRarity[]> = {
	COMUM: ['COMUM'],
	RARA: ['RARA', 'COMUM'],
	EPICO: ['EPICO', 'RARA', 'COMUM'],
	LENDARIO: ['LENDARIO', 'EPICO', 'RARA', 'COMUM'],
}

function randomInteger(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function chooseWeighted<T>(values: WeightedValue<T>[]): T {
	const totalWeight = values.reduce((total, entry) => total + entry.weight, 0)
	let roll = Math.random() * totalWeight

	for (const entry of values) {
		roll -= entry.weight
		if (roll < 0) return entry.value
	}

	return values[values.length - 1].value
}

function generateChestType(): ChestType | null {
	let roll = Math.random() * 100
	for (const entry of CHEST_DROP_CHANCES) {
		roll -= entry.weight
		if (roll < 0) return entry.value
	}
	return null
}

function generateCurrencyReward(type: 'MOEDA' | 'XP', config: ChestConfig): LootReward {
	const [min, max] = type === 'MOEDA' ? config.moedas : config.xp
	return { tipo: type, quantidade: randomInteger(min, max) }
}

async function loadChestItems(config: ChestConfig): Promise<Map<ItemRarity, RpgItem[]>> {
	const rarities = [...new Set(config.itemRarities.flatMap(entry => ITEM_RARITY_FALLBACK[entry.value]))]
	const results = await Promise.all(rarities.map(async rarity => {
		try {
			return [rarity, await BuscarItemPorTipo(rarity)] as const
		} catch (error) {
			console.error(`Não foi possível carregar itens de raridade ${rarity} para o baú:`, error)
			return [rarity, [] as RpgItem[]] as const
		}
	}))
	return new Map(results)
}

function generateReward(config: ChestConfig, itemsByRarity: Map<ItemRarity, RpgItem[]>): LootReward {
	const rewardType = chooseWeighted(config.rewardTypes)
	if (rewardType !== 'ITEM') return generateCurrencyReward(rewardType, config)

	const requestedRarity = chooseWeighted(config.itemRarities)
	const possibleItems = ITEM_RARITY_FALLBACK[requestedRarity]
		.flatMap(rarity => itemsByRarity.get(rarity) ?? [])
	const item = possibleItems.length
		? possibleItems[Math.floor(Math.random() * possibleItems.length)]
		: undefined

	if (!item) return generateCurrencyReward(Math.random() < 0.5 ? 'MOEDA' : 'XP', config)
	const [min, max] = config.itemQuantity
	return { tipo: 'ITEM', item, quantidade: randomInteger(min, max) }
}

export async function generateChestReward(): Promise<ChestReward | null> {
	const tipo = generateChestType()
	if (!tipo) return null

	const config = CHEST_CONFIG[tipo]
	const itemsByRarity = await loadChestItems(config)
	const rewardCount = randomInteger(config.minRewards, config.maxRewards)
	const conteudo = Array.from({ length: rewardCount }, () => generateReward(config, itemsByRarity))
	return { tipo, conteudo }
}
