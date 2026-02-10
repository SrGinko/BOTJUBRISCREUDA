const axios = require('axios')  
const { RAWG_API } = process.env

/**
 * 
 * @param {String} nameGame 
 * @returns {Objeto} Informações do jogo pesquisado na API
 */
async function BuscarjogoNome(nameGame) {
    const url = `https://api.rawg.io/api/games`

    try {
        const response = await axios.get(url, {
            params: {
                key: RAWG_API,
                search: nameGame
            }
        })

        if (response.data && response.data.results.length > 0) {
            return response.data.results
        } else {
            console.log('Nenhum jogo encontrado.');
            return [];
        }
    } catch (error) {
        console.error('Erro ao buscar o jogo:', error.message);
        return null;
    }
}

module.exports = { BuscarjogoNome }
