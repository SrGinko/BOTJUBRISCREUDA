import type { AutocompleteInteraction } from 'discord.js'
import { obterItens } from '../../../service/itensInventario'

export async function autocompleteLoja(interaction: AutocompleteInteraction): Promise<void> {
    const query = interaction.options.getFocused().toLowerCase()
    const items = await obterItens()
    const choices = items
        .filter(item => item.nome.toLowerCase().includes(query))
        .slice(0, 10)
        .map(item => ({
            name: item.nome.length > 100 ? `${item.nome.slice(0, 97)}...` : item.nome,
            value: String(item.id),
        }))
    await interaction.respond(choices)
}
