const { api } = require('./axiosClient')
const { buscarMember } = require('../service/discordService')

/**
 * 
 * @param {Inteiro} userId - id do usuário
 * @param {Inteiro} add - Quantidade de xp que será adicionada
 */
async function addXpHeroi(userId, add, moedaAdd) {

    const response = await api.get(`/heroi/${userId}`)

    const heroi = response.data
    const xp = heroi.xp + add
    const moeda = heroi.moeda + moedaAdd

    await api.patch(`/heroi/${userId}`, {
        xp: xp,
        moeda: moeda
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
    atualizarUsuario(userId, nivel)

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
    const heroi = await api.get(`/heroi/${userId}`).then(res => res.data).catch(err => console.error(err.data.message))

    const nivel = heroi.level
    const xp = heroi.xp
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
            hp: hp + 5,
            attack: ataque + 3,
            defense: defesa + 2,

        }).catch(err => console.error(err.data.message))
    }

    return Math.round(xpForNextLevel)
}

async function atualizarUsuario(userId, lvl) {
    const member = await buscarMember(userId)
    switch (true) {
        case lvl >= 0 && lvl < 20: {
            if (!member.roles.cache.has("1493936999084589136")) {

                member.roles.add("1493936999084589136").catch(console.error)
            }
        } break;
        case lvl >= 20 && lvl < 40: {
            if (!member.roles.cache.has("1493939683720167444")) {
                console.log("Atualizando cargo do usuário " + member.user.username + " para nível 20-39")
                member.roles.remove("1493936999084589136").catch(console.error)
                member.roles.add("1493939683720167444").catch(console.error)
            }
        } break;
        case lvl >= 40 && lvl < 70: {
            if (!member.roles.cache.has("1493941325421215824")) {
                member.roles.remove("1493939683720167444").catch(console.error)
                member.roles.add("1493941325421215824").catch(console.error)
            }
        } break;
        case lvl >= 70 && lvl < 110: {
            if (!member.roles.cache.has("1308663244742725653")) {
                member.roles.remove("1493941325421215824").catch(console.error)
                member.roles.add("1308663244742725653").catch(console.error)
            }
        }break;
    }
}

module.exports = { addLVL, addXp, calculateXpForNextLevel, addLVLHeroi, addXpHeroi }
