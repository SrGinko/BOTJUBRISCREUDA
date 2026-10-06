import { api } from "../service/axiosClient"

export async function obterInimigos() {
    let itens = await api.get('/inimigo')
    return itens.data
}

export async function obterUnicoInimigo(itemID: number) {
    let item = await api.get(`/inimigo/${itemID}`)
    return item.data
}
