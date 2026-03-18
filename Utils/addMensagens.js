const { api } = require('../Utils/axiosClient')

async function addMenssage(userId, quantidade) {
    try {
        const user = await api.get(`/usuario/${userId}`).then(res => res.data)
        const mensagens = user.quantidadeMensagens
        const novaQuantidade = mensagens + quantidade

        await api.patch(`/usuario/${userId}`, {
            quantidadeMensagens: novaQuantidade
        })

        return novaQuantidade

    } catch (error) {
        console.error(error)
    }
}
module.exports = { addMenssage }