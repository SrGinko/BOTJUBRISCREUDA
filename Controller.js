const { api } = require('./Utils/axiosClient')

/**
 * @returns  {Array} - Retorna um array de usuários já em ordem crescente 
 */
async function ranking() {
    const response = await api.get(`/usuario`)

    const user = response.data
    user.sort((a, b) => {
        if (b.nivel === a.nivel) {
            return b.xp - a.xp
        }
        return b.nivel - a.nivel
    })
    return user
}

function chance(percent) {
    return Math.random() < percent / 100;
}


module.exports = { ranking, chance }