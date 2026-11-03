import type { AutocompleteInteraction } from 'discord.js'
import { BuscarjogoNome } from '../../service/buscarJogos'

export async function autocompleteGames(interaction: AutocompleteInteraction): Promise<void> {
    const query = interaction.options.getFocused()
    if (!query) {
        await interaction.respond([])
        return
    }

    const games = await BuscarjogoNome(query)
    const choices = (games ?? []).slice(0, 10).map(game => ({
        name: game.nome.length > 100 ? `${game.nome.slice(0, 97)}...` : game.nome,
        value: game.appid,
    }))

    await interaction.respond(choices)
}
