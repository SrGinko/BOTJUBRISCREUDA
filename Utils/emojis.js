const axios = require('axios')

/**
 * Cria um emoji customizado temporário a partir de uma URL
 * @param {Guild} guild - Servidor onde o emoji será criado
 * @param {string} url - URL da imagem (png/jpg/gif até 256kb)
 * @param {string} name - Nome do emoji
 * @param {number} lifetime - Tempo de vida em ms (depois será deletado)
 * @returns {Promise<GuildEmoji>}
 */
async function icone(guild, url, name, lifetime = 60000) {
    const response = await axios.get(url, { responseType: 'arraybuffer' })

    const emoji = await guild.emojis.create({
        attachment: Buffer.from(response.data, 'utf-8'),
        name: name
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

module.exports = { icone }