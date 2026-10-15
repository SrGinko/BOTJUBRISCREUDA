const axios = require('axios')
const cheerio = require('cheerio')
import type { SteamGame, SteamGameSearchResult } from '../types/SteamGame'

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
        const jogos: SteamGameSearchResult[] = []
        $(".match").each((index: number, element:any) => {
            const appid = $(element).attr("data-ds-appid")
            if (!appid) return

            jogos.push({
                appid,
                nome: $(element).find(".match_name").text().trim(),
            })
        })

        return jogos

    } catch (error: unknown) {
        console.error('Erro ao buscar o jogo:', error instanceof Error ? error.message : error);
        return null;
    }
}

export async function BuscarjogoId(appid: string): Promise<SteamGame | null> {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appid}`
    try {
        const { data } = await axios.get(url,{
            params: {
                    cc: "br",
                    l: "brazilian",
            }
        })

        const result = data[appid] as { success?: boolean; data?: SteamGame } | undefined
        return result?.success ? result.data ?? null : null
    }
    catch (error: unknown) {
        console.error('Erro ao buscar o jogo:', error instanceof Error ? error.message : error);
        return null;
    }
}
