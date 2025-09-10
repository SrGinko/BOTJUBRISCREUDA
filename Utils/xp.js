const { api } = require('./axiosClient')

/**
 * 
 * @param {Inteiro} userId - id do usuário
 * @param {Inteiro} add - Quantidade de xp que será adicionada
 */
async function addXp(userId, add) {

    const date = new Date()
    const diaSemana = date.getDay()

    if (diaSemana === 0 || diaSemana === 6) {
        add = add * 2
    }

    const response = await api.get(`/usuario/${userId}`)

    const usuario = response.data
    const xp = usuario.xp + add

    await api.patch(`/usuario/${userId}`, {
        xp: xp
    })

    await addLVL(userId)

}

/**
 * 
 * @param {Inteiro} level - Nivel atual do usuario
 * @returns {Inteiro} - Xp necessária para o próximo nivel
 */
function calculateXpForNextLevel(level) {
    return 100 * Math.pow(1.5, level - 1)
}

/**
 * 
 * @param {Inteiro} userId - id usuário
 */
async function addLVL(userId) {
    const response = await api.get(`/usuario/${userId}`)
    const usuario = response.data

    const nivel = usuario.nivel
    const xp = usuario.xp

    const xpForNextLevel = await calculateXpForNextLevel(nivel);

    if (xp >= xpForNextLevel) {
        let newXp = xp - xpForNextLevel
        let newLvl = nivel + 1

        await api.patch(`/usuario/${userId}`, {
            xp: newXp,
            nivel: newLvl
        })
    }

    return Math.round(xpForNextLevel)
}

module.exports = { addLVL, addXp }