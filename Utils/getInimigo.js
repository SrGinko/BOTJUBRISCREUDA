const { api, apiTeste } = require("./axiosClient");

/**
 * 
 * @returns Array de Objetos com os Inimigos
 */
async function obterInimigos() {
    let itens = await api.get('/inimigo')
    return itens.data
}

/**
 * 
 * @param {Integer} itemID 
 * @returns Objeto com os dados do Inimigo
 */
async function obterUnicoInimigo(itemID) {
    let item = await api.get(`/inimigo/${itemID}`)
    return item.data
}


module.exports = { obterInimigos, obterUnicoInimigo }
