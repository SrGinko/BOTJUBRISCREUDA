import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    MessageFlags,
    SectionBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    StringSelectMenuBuilder,
    TextDisplayBuilder,
    ThumbnailBuilder,
    hyperlink,
    type ButtonInteraction,
    type StringSelectMenuInteraction,
} from 'discord.js'
import { hydraLinks as links } from '../data/hydraLinks'

const selectionPageSize = 25
const textDisplayLimit = 4000
const hydraLinks = [...links].sort((a, b) => {
    if (a.name === 'Todos') return -1
    if (b.name === 'Todos') return 1
    return a.name.localeCompare(b.name, 'pt-br')
})
const hydraHeader = `# <:hydra:1463850338967621633> HydraLauncher
- Link de Download da HydraLauncher ${hyperlink('Clique aqui', 'https://github.com/hydralauncher/hydra/releases/')}
- Tutorial de como Instalar ${hyperlink('Clique aqui', 'https://youtu.be/Yo9fka6A6RE?si=zSjO1txthuQsFcjU')}`

function getSelectionPage(page: number) {
    return hydraLinks.slice(page * selectionPageSize, (page + 1) * selectionPageSize)
}

function createHydraContainer(): ContainerBuilder {
    return new ContainerBuilder({ accent_color: 0xffffff })
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder({ content: hydraHeader }))
                .setThumbnailAccessory(
                    new ThumbnailBuilder({
                        media: { url: 'https://github.com/hydralauncher/hydra/raw/main/resources/icon.png' },
                    }),
                ),
        )
}

export function createHydraSelection(page: number): ContainerBuilder {
    const pageLinks = getSelectionPage(page)
    if (pageLinks.length === 0) throw new RangeError(`Página de links Hydra inválida: ${page}`)

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`hydra:select:${page}`)
        .setPlaceholder('Selecione os links')
        .setMinValues(1)
        .setMaxValues(pageLinks.length)
        .addOptions(pageLinks.map(link => ({
            label: link.name,
            value: link.id,
        })))

    const container = createHydraContainer()
        .addActionRowComponents(new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu))

    const lastPage = Math.ceil(hydraLinks.length / selectionPageSize) - 1
    if (lastPage > 0) {
        container.addActionRowComponents(
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId(`hydra:menu:${page - 1}`)
                    .setLabel('Links anteriores')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === 0),
                new ButtonBuilder()
                    .setCustomId(`hydra:menu:${page + 1}`)
                    .setLabel('Mais links')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === lastPage),
            ),
        )
    }

    return container
}

function getSelectedLinks(sourcePage: number, selection: string): typeof hydraLinks {
    if (selection === 'all') return hydraLinks.filter(link => link.id !== 'todos')

    const mask = BigInt(`0x${selection}`)
    return getSelectionPage(sourcePage).filter((link, index) => (mask & (1n << BigInt(index))) !== 0n)
}

function createHydraResults(
    links: typeof hydraLinks,
    sourcePage: number,
): ContainerBuilder {
    const container = createHydraContainer().addSeparatorComponents(
        new SeparatorBuilder({ spacing: SeparatorSpacingSize.Small }),
    )
    let content = ''

    for (const link of links) {
        const line = `**${link.name}:** \`\`\`${link.link}\`\`\`\n`
        if (content.length + line.length > textDisplayLimit && content.length > 0) {
            container.addTextDisplayComponents(new TextDisplayBuilder({ content }))
            content = ''
        }
        content += line
    }

    if (content) container.addTextDisplayComponents(new TextDisplayBuilder({ content }))

    container.addActionRowComponents(
        new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(`hydra:menu:${sourcePage}`)
                .setLabel('Voltar para selecionar outros links')
                .setStyle(ButtonStyle.Secondary),
        ),
    )

    return container
}

export async function handleHydraSelect(interaction: StringSelectMenuInteraction): Promise<void> {
    const pageMatch = interaction.customId.match(/^hydra:select:(\d+)$/)
    const sourcePage = pageMatch ? Number(pageMatch[1]) : 0
    const pageLinks = getSelectionPage(sourcePage)
    const selectedIds = new Set(interaction.values)

    if (selectedIds.has('todos')) {
        const links = getSelectedLinks(sourcePage, 'all')
        await interaction.update({
            components: [createHydraResults(links, sourcePage)],
            flags: MessageFlags.IsComponentsV2,
        })
        return
    }

    const selectionMask = pageLinks.reduce(
        (mask, link, index) => selectedIds.has(link.id) ? mask | (1n << BigInt(index)) : mask,
        0n,
    )
    const selection = selectionMask.toString(16)
    const links = getSelectedLinks(sourcePage, selection)

    if (links.length === 0) {
        await interaction.update({
            components: [createHydraContainer().addTextDisplayComponents(
                new TextDisplayBuilder({ content: 'Nenhum jogo encontrado.' }),
            )],
            flags: MessageFlags.IsComponentsV2,
        })
        return
    }

    await interaction.update({
        components: [createHydraResults(links, sourcePage)],
        flags: MessageFlags.IsComponentsV2,
    })
}

export async function handleHydraButton(interaction: ButtonInteraction): Promise<boolean> {
    const [, action, ...params] = interaction.customId.split(':')

    if (action === 'menu') {
        const page = Number(params[0])
        const lastPage = Math.ceil(hydraLinks.length / selectionPageSize) - 1
        if (!Number.isInteger(page) || page < 0 || page > lastPage) {
            await interaction.reply({ content: 'Esta página de links não é válida.', flags: MessageFlags.Ephemeral })
            return true
        }
        await interaction.update({
            components: [createHydraSelection(page)],
            flags: MessageFlags.IsComponentsV2,
        })
        return true
    }

    return false
}
