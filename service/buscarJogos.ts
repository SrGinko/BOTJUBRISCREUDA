const axios = require('axios')
const cheerio = require('cheerio')

export async function BuscarjogoNome(nome: string) {

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
        const jogos: { appid: string; nome: string }[] = []
        $(".match").each((index: number, element:any) => {
            jogos.push({
                appid: $(element).attr("data-ds-appid"),
                nome: $(element).find(".match_name").text().trim(),
            })
        })

        return jogos

    } catch (error: unknown) {
        console.error('Erro ao buscar o jogo:', error instanceof Error ? error.message : error);
        return null;
    }
}

export async function BuscarjogoId(appid: string) {
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
    catch (error: unknown) {
        console.error('Erro ao buscar o jogo:', error instanceof Error ? error.message : error);
        return null;
    }
}
