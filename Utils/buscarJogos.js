const axios = require('axios')
const cheerio = require('cheerio')

/**
 * 
 * @param {String} nameGame 
 * @returns {Objeto} Informações do jogo pesquisado na API
 */
async function BuscarjogoNome(nome) {
    const url = `https://api.rawg.io/api/games`

    try {
        const { data } = await axios.get("https://store.steampowered.com/search/suggest", {
            params: {
                term: nome,
                f: "games",
                cc: "BR",
                l: "portuguese",
            }
        })

        const $ = cheerio.load(data)
        const jogos = []
        $(".match").each((index, element) => {
            jogos.push({
                appid: $(element).attr("data-ds-appid"),
                nome: $(element).find(".match_name").text().trim(),
            })
        })

        return jogos

    } catch (error) {
        console.error('Erro ao buscar o jogo:', error.message);
        return null;
    }
}

async function BuscarjogoId(appid) {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appid}`
    try {
        const { data } = await axios.get(url,{
            params: {
                    cc: "br",
                    l: "brazilian",
            }
        })

        return data[appid].data
    }
    catch (error) {
        console.error('Erro ao buscar o jogo:', error.message);
        return null;
    }
}



module.exports = { BuscarjogoNome, BuscarjogoId  }
