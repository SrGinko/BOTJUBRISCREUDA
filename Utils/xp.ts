import { api } from "../service/axiosClient"
import buscarMember from "../service/discordService"


export async function addXpHeroi(userId: string, add: number, moedaAdd: number) {

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

export async function addXp(userId: string, add: number) {

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


export function calculateXpForNextLevel(level: number) {
    return 100 * Math.pow(1.5, level - 1)
}


export async function addLVL(userId: string) {
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


export async function addLVLHeroi(userId: string) {
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

export async function atualizarUsuario(userId: string, lvl: number) {
    const member = await buscarMember(userId)

    switch (true) {
        case lvl >= 0 && lvl < 20: {
            if (!member.roles.cache.has("1493936999084589136")) {

                member.roles.add("1493936999084589136").catch(console.error)
            }
        } break;
        case lvl >= 20 && lvl < 40: {
            if (!member.roles.cache.has("1493939683720167444")) {
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
        } break;
    }
}