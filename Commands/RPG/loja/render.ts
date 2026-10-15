import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    SectionBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder,
    ThumbnailBuilder,
} from 'discord.js'
import type { RpgItem } from '../../../types/RPG'

const rarityColors: Record<string, number> = {
    COMUM: 0x00ff00,
    RARA: 0x0095ff,
    EPICO: 0x8400ff,
    LENDARIO: 0xff4500,
}

export function renderItemCard(item: RpgItem): ContainerBuilder {
    const container = new ContainerBuilder({ accent_color: rarityColors[item.raridade ?? ''] ?? 0x1f1f1f })
    const description = `# ${item.nome}\n\n>>> ${item.descricao ?? 'Sem descrição disponível.'}`

    if (item.imagem) {
        container.addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder({ content: description }))
                .setThumbnailAccessory(new ThumbnailBuilder({ media: { url: item.imagem } })),
        )
    } else {
        container.addTextDisplayComponents(new TextDisplayBuilder({ content: description }))
    }

    container.addSeparatorComponents(new SeparatorBuilder({ spacing: SeparatorSpacingSize.Small }))
    container.addTextDisplayComponents(new TextDisplayBuilder({
        content: `### Informações do item\n**Raridade:** ${item.raridade ?? 'Não informada'}\n**Tipo:** ${item.tipo}\n**Valor:** ${item.preco ?? 0} moedas`,
    }))

    const attributes = [
        item.heal ? `**❤️ Vida:** ${item.heal}` : '',
        item.ataque ? `**⚔️ Ataque:** ${item.ataque}` : '',
        item.defesa ? `**🛡️ Defesa:** ${item.defesa}` : '',
        item.mana ? `**🔮 Mana:** ${item.mana}` : '',
    ].filter(Boolean)
    if (attributes.length) {
        container.addTextDisplayComponents(new TextDisplayBuilder({ content: `### Atributos\n${attributes.join('\n')}` }))
    }

    container.addSeparatorComponents(new SeparatorBuilder({ spacing: SeparatorSpacingSize.Small, divider: true }))
    container.addActionRowComponents(
        new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(`loja:comprar:${item.id}`)
                .setLabel('Comprar')
                .setStyle(ButtonStyle.Success),
        ),
    )
    return container
}
