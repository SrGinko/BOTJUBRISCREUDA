const { api } = require('./axiosClient')

/**
 * 
 * @param {Inteiro} userId - id do usuário
 * @param {Inteiro} add - Quantidade de mensagem que será adicionada
 */
async function addMenssage(userId, add) {
    const response = await api.get(`/usuario/${userId}`)

    const usuario = response.data
    const msg = usuario.quantidadeMensagens + add
    await api.patch(`/usuario/${userId}`, {
        quantidadeMensagens: msg
    })

    return msg
}

module.exports = { addMenssage }