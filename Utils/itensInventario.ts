import { api } from "../service/axiosClient"

export async function obterItensInventario(userId: string) {
    const heroi = await api.get(`/heroi/${userId}`)
    const itens = heroi.data.inventario.itens.map((item: any) => {
        return {
            quantidade: item.quantidade,
            item: item.item,
        }
    })

    return itens
}

export async function obterItens() {
    let itens = await api.get('/itens').then(res => res)
    return itens.data
}

export async function obterUnicoItem(itemID: string) {
    let item = await api.get(`/itens/${itemID}`)
    return item.data
}

export async function addItem(userID: string, itemID: string, quantidade = 1) {
    const res = await api.get(`/heroi/${userID}`)
    const heroi = res.data


    await api.patch(`heroi/${heroi.id}/inventario/adicionar`, {
        itemID: itemID,
        quantidade: quantidade
    })
}


export async function removeItem(userID: string, itemID: string, quantidade: number) {
    const res = await api.get(`/heroi/${userID}`)
    const heroi = res.data

    await api.patch(`heroi/${heroi.id}/inventario/remover`, {
        itemID: itemID,
        quantidade: quantidade
    })
}

export async function equiparItem(userId: string, itensID: { arma?: string, armadura?: string, calca?: string }) {

    const res = await api.get(`/heroi/${userId}`)
    const heroi = res.data

    if (itensID.arma) {

        if (heroi.armaID) {
            await addItem(userId, heroi.armaID)
        }

        await api.patch(`/heroi/${userId}`, {
            armaID: itensID.arma
        })

        removeItem(userId, itensID.arma, 1)
    }
    if (itensID.armadura) {

        if (heroi.armaID) {
            await addItem(userId, heroi.armaID)
        }


        await api.patch(`/heroi/${userId}`, {
            armaduraID: itensID.armadura
        })

        removeItem(userId, itensID.armadura, 1)
    }
    if (itensID.calca) {

        if (heroi.armaID) {
            await addItem(userId, heroi.armaID)
        }


        await api.patch(`/heroi/${userId}`, {
            calcaID: itensID.calca
        })

        removeItem(userId, itensID.calca, 1)
    }

}

export async function BuscarItemPorTipo(tipo: string) {
    const res = await api.get(`itens/raridade/${tipo}`)
    const itens = res.data

    return itens
}
