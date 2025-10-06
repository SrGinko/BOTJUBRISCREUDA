const { api, apiTeste } = require("./axiosClient");

/**
 * 
 * @param {Integer} userId 
 * @returns  Um Array de objeto com os itens
 */
async function obterItensInventario(userId) {
    const heroi = await api.get(`/heroes/${userId}`)

    const itens = heroi.data.inventario.itens.map(item => { return item.item })

    return itens
}

/**
 * 
 * @returns Array de Objetos com os itens
 */
async function obterItens() {
    let itens = await api.get('/itens')
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

    await api.patch(`heroes/${heroiID}/inventario/adicionar`, {
        itemID: itemID,
        quantidade: quantidade
    })
}


/**
 * Remove um item do inventario do heroi
 * @param {*Number} heroiID - ID do Heroi 
 * @param {*Number} itemID - ID do Item 
 * @param {*Number} quantidade - Quantidade que será removida
 */
async function removeItem(heroiID, itemID, quantidade) {

    await api.patch(`heroes/${heroiID}/inventario/remover`, {
        itemID: itemID,
        quantidade: quantidade
    })
}

module.exports = { obterItensInventario, obterItens, obterUnicoItem, addItem, removeItem }
