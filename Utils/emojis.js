const emojisData = require('../data/emojis')

/**
 * Cria um emoji customizado temporário a partir de uma URL
 * @param {Guild} guild - Servidor onde o emoji será criado
 * @param {string} url - URL da imagem (png/jpg/gif até 256kb)
 * @param {string} name - Nome do emoji
 * @param {number} lifetime - Tempo de vida em ms (depois será deletado)
 * @returns {Promise<GuildEmoji>}
 */

function emoji(name) {
    const emoji = emojisData.emojis.consquista.find(e => e.name === name)
    return emoji ? emoji.icone : null
}

module.exports = { emoji }