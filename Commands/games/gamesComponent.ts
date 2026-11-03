import { MessageFlags, type ButtonInteraction, type GuildForumTagData } from 'discord.js'
import { BuscarjogoId } from '../../service/buscarJogos'
import { addXp } from '../../Utils/xp'
import {
    criarGameInfoViewer,
    criarGameRequirementsViewer,
    criarGameScreenshotsViewer,
} from './gamesRenderer'

const suggestionsForumId = '1428656735505223720'

export async function handleGamesComponent(interaction: ButtonInteraction): Promise<void> {
    const [, action, appId, context] = interaction.customId.split(':')
    if (!action || !appId) {
        await interaction.reply({ content: 'Esta ação de jogo é inválida ou expirou.', flags: MessageFlags.Ephemeral })
        return
    }

    const jogo = await BuscarjogoId(appId)
    if (!jogo) {
        await interaction.reply({
            content: 'Não foi possível encontrar esse jogo.',
            flags: MessageFlags.Ephemeral,
        })
        return
    }

    const suggestion = context === 'suggestion'

    switch (action) {
        case 'info':
            await interaction.update({
                components: [criarGameInfoViewer(jogo, appId, suggestion)],
                flags: MessageFlags.IsComponentsV2,
            })
            return

        case 'imagens':
            await interaction.update({
                components: [criarGameScreenshotsViewer(jogo, appId, suggestion)],
                flags: MessageFlags.IsComponentsV2,
            })
            return

        case 'requisitos':
            await interaction.update({
                components: [criarGameRequirementsViewer(jogo, appId, suggestion)],
                flags: MessageFlags.IsComponentsV2,
            })
            return

        case 'suggest':
            await interaction.deferUpdate()
            await createSuggestionPost(interaction, jogo, appId)
            void addXp(interaction.user.id, 50).catch(console.error)
            return

        default:
            await interaction.reply({ content: 'Esta ação de jogo não é reconhecida.', flags: MessageFlags.Ephemeral })
            return
    }
}

async function createSuggestionPost(
    interaction: ButtonInteraction,
    jogo: NonNullable<Awaited<ReturnType<typeof BuscarjogoId>>>,
    appId: string,
): Promise<void> {
    const channel = await interaction.client.channels.fetch(suggestionsForumId)
    if (!channel?.isThreadOnly()) {
        throw new Error('O canal de sugestões configurado não é um fórum válido.')
    }

    const genres = [...new Set(jogo.genres?.map(genre => genre.description) ?? [])]
    const tags: GuildForumTagData[] = channel.availableTags.map(tag => ({
        id: tag.id,
        name: tag.name,
        emoji: tag.emoji ?? undefined,
    }))
    const existingNames = new Set(tags.map(tag => tag.name.toLowerCase()))

    for (const genre of genres) {
        if (!existingNames.has(genre.toLowerCase()) && tags.length < 20) {
            tags.push({ name: genre })
            existingNames.add(genre.toLowerCase())
        }
    }

    await channel.setAvailableTags(tags)
    const updatedChannel = await interaction.client.channels.fetch(suggestionsForumId)
    if (!updatedChannel?.isThreadOnly()) {
        throw new Error('Não foi possível recarregar o fórum de sugestões.')
    }

    const appliedTags = updatedChannel.availableTags
        .filter(tag => genres.some(genre => genre.toLowerCase() === tag.name.toLowerCase()))
        .map(tag => tag.id)
        .slice(0, 5)

    await updatedChannel.threads.create({
        name: jogo.name,
        message: {
            flags: MessageFlags.IsComponentsV2,
            components: [criarGameInfoViewer(jogo, appId, true)],
        },
        appliedTags,
    })
}
