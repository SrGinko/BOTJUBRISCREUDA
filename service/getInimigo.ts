import { api } from "./axiosClient"
import type { EnemyData } from "../types/RPG"

export async function obterInimigos(): Promise<EnemyData[]> {
    const { data } = await api.get<EnemyData[]>('/inimigo')
    return data
}

export async function obterUnicoInimigo(itemId: number): Promise<EnemyData> {
    const { data } = await api.get<EnemyData>(`/inimigo/${itemId}`)
    return data
}
