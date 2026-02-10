const { api, apiTeste } = require("./axiosClient");

/**
 * 
 * @param {Integer} userId 
 * @returns  Um Array de objeto com os itens
 */
async function obterItensInventario(userId) {
    const heroi = await api.get(`/heroi/${userId}`)
    const itens = heroi.data.inventario.itens.map(item => {
        return {
            quantidade: item.quantidade,
            item: item.item,
        }
    })

    return itens
}

/**
 * 
 * @returns Array de Objetos com os itens
 */
async function obterItens() {
    let itens = await api.get('/itens').then(res => res)
    return itens.data
}

/**
 * 
 * @param {Integer} itemID 
 * @returns Objeto com os dados do Item
 */
async function obterUnicoItem(itemID) {
    let item = await api.get(`/itens/${itemID}`)
    return item.data
}

/**
 * Adiciona um item ao inventario do heroi
 * @param {*Number} heroiID - ID do Heroi 
 * @param {*Number} itemID - ID do Item 
 * @param {*Number} quantidade - Quantidade que será adicionada
 */
async function addItem(heroiID, itemID, quantidade) {

    await api.patch(`heroi/${heroiID}/inventario/adicionar`, {
        itemID: itemID,
        quantidade: quantidade
    })
}


/**
 * Remove um item do inventario do heroi
 * @param {*Number} userID - ID do Heroi 
 * @param {*Number} itemID - ID do Item 
 * @param {*Number} quantidade - Quantidade que será removida
 */
async function removeItem(userID, itemID, quantidade) {
    const res = await api.get(`/heroi/${userID}`)
    const heroi = res.data

    await api.patch(`heroi/${heroi.id}/inventario/remover`, {
        itemID: itemID,
        quantidade: quantidade
    })
}


/** * Equipa os itens no heroi e remove os itens do inventário
 * @param {*Number} userId - ID do Usuário
 * @param {*Number} armaID - ID da Arma
 * @param {*Number} armaduraID - ID da Armadura
 * @param {*Number} calcaID - ID da Calça
 *
 */
async function equiparItem(userId, itensID) {
    
    if (itensID.arma) {
        await api.patch(`/heroi/${userId}`, {
            armaID: itensID.arma
        })

        removeItem(userId, itensID.arma, 1)
    }
    if (itensID.armadura) {
        await api.patch(`/heroi/${userId}`, {
            armaduraID: itensID.armadura
        })

        removeItem(userId, itensID.armadura, 1)
    }
    if (itensID.calca) {
        await api.patch(`/heroi/${userId}`, {
            calcaID: itensID.calca
        })

        removeItem(userId, itensID.calca, 1)
    }

}

module.exports = { obterItensInventario, obterItens, obterUnicoItem, addItem, removeItem, equiparItem }