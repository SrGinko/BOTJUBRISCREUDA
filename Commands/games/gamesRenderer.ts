import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    MediaGalleryBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder,
} from 'discord.js'
import { ConversorHtmltoText } from '../../Utils/ConversorHtmltoText'
import type { SteamGame } from '../../types/SteamGame'

function createContainer(options: {
    banner?: string
    content?: string
    buttons?: ButtonBuilder[]
}): ContainerBuilder {
    const container = new ContainerBuilder()

    if (options.banner) {
        container.addMediaGalleryComponents(
            new MediaGalleryBuilder({ items: [{ media: { url: options.banner } }] }),
        )
    }

    if (options.content) {
        container.addSeparatorComponents(
            new SeparatorBuilder({ spacing: SeparatorSpacingSize.Large, divider: false }),
        )
        container.addTextDisplayComponents(new TextDisplayBuilder({ content: options.content }))
    }

    if (options.buttons?.length) {
        container.addActionRowComponents(
            new ActionRowBuilder<ButtonBuilder>().addComponents(...options.buttons),
        )
    }

    return container
}

export function criarGameInfoViewer(jogo: SteamGame, appId: string, suggestion = false): ContainerBuilder {
    const descricao = ConversorHtmltoText(jogo.short_description ?? '') || 'Nenhuma descrição disponível'
    const genres = jogo.genres?.map(genre => genre.description).join(', ') || 'Não informado'
    const categories = jogo.categories?.slice(0, 10).map(category => category.description).join(', ') || 'Não informado'
    const price = jogo.is_free ? 'Gratuito' : jogo.price_overview?.final_formatted || 'Desconhecido'
    const metacritic = jogo.metacritic
        ? `[${jogo.metacritic.score}](${jogo.metacritic.url})`
        : 'Desconhecido'

    const content = `# ${jogo.name}

<:moedas:1463846758282170521> ${price}

**Metacritic:** ${metacritic}
${jogo.website ? `[Website](${jogo.website})` : ''}

> ${descricao}

**Lançamento:** ${jogo.release_date?.coming_soon ? 'Em breve' : jogo.release_date?.date || 'Desconhecido'}
**Gêneros:** ${genres}
**Categorias:** ${categories}`

    return createContainer({
        banner: jogo.background_raw,
        content,
        buttons: [
            new ButtonBuilder()
                .setEmoji('<:foto:1463846754322747497>')
                .setLabel('Imagens')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(`games:imagens:${appId}${suggestion ? ':suggestion' : ''}`),
            new ButtonBuilder()
                .setEmoji('<:estatisitcas:1463846753110331537>')
                .setLabel('Requisitos')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(`games:requisitos:${appId}${suggestion ? ':suggestion' : ''}`),
            new ButtonBuilder()
                .setEmoji('➕')
                .setLabel('Adicionar Sugestão')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(`games:suggest:${appId}`)
                .setDisabled(suggestion),
            new ButtonBuilder()
                .setEmoji('<:moedas:1463846758282170521>')
                .setLabel('Comprar')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://store.steampowered.com/app/${appId}`),
        ],
    })
}

export function criarGameScreenshotsViewer(jogo: SteamGame, appId: string, suggestion = false): ContainerBuilder {
    const screenshots = jogo.screenshots?.slice(0, 10) ?? []
    const container = new ContainerBuilder()

    if (screenshots.length) {
        container.addMediaGalleryComponents(
            new MediaGalleryBuilder({
                items: screenshots.map(screenshot => ({ media: { url: screenshot.path_full } })),
            }),
        )
    } else {
        container.addTextDisplayComponents(new TextDisplayBuilder({ content: 'Nenhuma imagem disponível.' }))
    }

    container.addActionRowComponents(
        new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('Voltar')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(`games:info:${appId}${suggestion ? ':suggestion' : ''}`),
        ),
    )
    return container
}

export function criarGameRequirementsViewer(jogo: SteamGame, appId: string, suggestion = false): ContainerBuilder {
    const minimum = jogo.pc_requirements?.minimum
        ? ConversorHtmltoText(jogo.pc_requirements.minimum)
        : 'Não disponíveis'
    const recommended = jogo.pc_requirements?.recommended
        ? ConversorHtmltoText(jogo.pc_requirements.recommended)
        : 'Não disponíveis'

    return createContainer({
        banner: jogo.background_raw,
        content: `# Requisitos mínimos\n\n${minimum}\n\n# Requisitos recomendados\n\n${recommended}`,
        buttons: [new ButtonBuilder()
            .setLabel('Voltar')
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`games:info:${appId}${suggestion ? ':suggestion' : ''}`)],
    })
}
