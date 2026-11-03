import { api } from './axiosClient'
import type { HeroData, InventoryEntry, RpgItem } from '../types/RPG'

interface HeroInventoryResponse extends HeroData {
    inventario?: { itens?: InventoryEntry[] }
}

export async function obterItensInventario(userId: string): Promise<InventoryEntry[]> {
    const { data } = await api.get<HeroInventoryResponse>(`/heroi/${userId}`)
    return data.inventario?.itens ?? []
}

export async function obterItens(): Promise<RpgItem[]> {
    const { data } = await api.get<RpgItem[]>('/itens')
    return data
}

export async function obterUnicoItem(itemId: number | string): Promise<RpgItem> {
    const { data } = await api.get<RpgItem>(`/itens/${itemId}`)
    return data
}

export async function addItem(userId: string, itemId: number | string, quantidade = 1): Promise<void> {
    const { data: hero } = await api.get<HeroData>(`/heroi/${userId}`)
    await api.patch(`/heroi/${hero.id ?? userId}/inventario/adicionar`, { itemID: itemId, quantidade })
}

export async function removeItem(userId: string, itemId: number | string, quantidade: number): Promise<void> {
    const { data: hero } = await api.get<HeroData>(`/heroi/${userId}`)
    await api.patch(`/heroi/${hero.id ?? userId}/inventario/remover`, { itemID: itemId, quantidade })
}

export async function equiparItem(
    userId: string,
    selectedItems: { arma?: number; armadura?: number; calca?: number },
): Promise<void> {
    const { data: hero } = await api.get<HeroData>(`/heroi/${userId}`)
    const equipmentSlots = [
        { selectedId: selectedItems.arma, currentId: hero.armaID, field: 'armaID' as const },
        { selectedId: selectedItems.armadura, currentId: hero.armaduraID, field: 'armaduraID' as const },
        { selectedId: selectedItems.calca, currentId: hero.calcaID, field: 'calcaID' as const },
    ]

    for (const slot of equipmentSlots) {
        if (!slot.selectedId || slot.selectedId === slot.currentId) continue
        if (slot.currentId) await addItem(userId, slot.currentId)
        await api.patch(`/heroi/${userId}`, { [slot.field]: slot.selectedId })
        await removeItem(userId, slot.selectedId, 1)
    }
}

export async function BuscarItemPorTipo(tipo: string): Promise<RpgItem[]> {
    const { data } = await api.get<RpgItem[]>(`/itens/raridade/${tipo}`)
    return data
}
