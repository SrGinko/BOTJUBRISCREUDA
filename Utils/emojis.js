const axios = require('axios')
const emojisData = require('../data/emojis')

/**
 * Cria um emoji customizado temporário a partir de uma URL
 * @param {Guild} guild - Servidor onde o emoji será criado
 * @param {string} url - URL da imagem (png/jpg/gif até 256kb)
 * @param {string} name - Nome do emoji
 * @param {number} lifetime - Tempo de vida em ms (depois será deletado)
 * @returns {Promise<GuildEmoji>}
 */
async function icone(guild, name, lifetime = 20000) {
    const icone = emojisData.interfaces.find(e => e.name === name)
    const response = await axios.get(icone.url, { responseType: 'arraybuffer' })

    const emoji = await guild.emojis.create({
        attachment: Buffer.from(response.data, 'utf-8'),
        name: icone.name
    })

    setTimeout( async () => {
        try {
            await emoji.delete('Emoji temporário expirado')
        } catch (error) {
            console.log(error)
        }
    }, lifetime)

    return emoji
}

function emoji(name) {
    const emoji = emojisData.emojis.consquista.find(e => e.name === name)
    return emoji ? emoji.icone : null
}

module.exports = { icone, emoji }