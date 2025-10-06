const { api } = require('./axiosClient')

/**
 * 
 * @param {Inteiro} userId - id do usuário
 * @param {Inteiro} add - Quantidade de xp que será adicionada
 */
async function addXpHeroi(userId, add) {

    const response = await api.get(`/heroi/${userId}`)

    const heroi = response.data
    const xp = heroi.xp + add

    await api.patch(`/heroi/${userId}`, {
        xp: xp
    })

    await addLVLHeroi(userId)

}

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


/**
 * 
 * @param {Inteiro} userId - id usuário
 */
async function addLVLHeroi(userId) {
    const response = await api.get(`/heroi/${userId}`)
    const heroi = response.data

    const nivel = heroi.nivel
    const xp = heroi.xp
    const moeda = heroi.moeda
    const hp = heroi.hp
    const ataque = heroi.attack
    const defesa = heroi.defense

    const xpForNextLevel = await calculateXpForNextLevel(nivel);

    if (xp >= xpForNextLevel) {
        let newXp = xp - xpForNextLevel
        let newLvl = nivel + 1

        await api.patch(`/heroi/${userId}`, {
            xp: newXp,
            level: newLvl,
            hp: hp + 10,
            attack: ataque + 10,
            defense: defesa + 5,
            
        })
    }

    return Math.round(xpForNextLevel)
}

module.exports = { addLVL, addXp, calculateXpForNextLevel, addLVLHeroi, addXpHeroi}
