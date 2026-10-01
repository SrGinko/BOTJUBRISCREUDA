const { SlashCommandBuilder, StringSelectMenuBuilder, ContainerBuilder, TextDisplayBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, MediaGalleryBuilder, SeparatorBuilder, SeparatorSpacingSize, ButtonBuilder } = require("discord.js")
const { BuscarjogoId } = require("../../Utils/buscarJogos")
const { addXp } = require("../../Utils/xp")
const { ConversorHtmltoText } = require("../../Utils/ConversorHtmltoText")
const { criarEmbed } = require("../../Utils/embedFactory")
const { handleError } = require("../../handlers/errorsHandler")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('games')
        .setDescription('Busca algumas informações de um determinado jogo')
        .addStringOption(option => option.setName('game').setDescription('Insira o nome do jogo').setAutocomplete(true).setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply()

        const appId = interaction.options.getString('game');

        const jogo = await BuscarjogoId(appId)

        if (!jogo) {
            return handleError(interaction, 'Não foi possível encontrar informações sobre esse jogo. Verifique se o nome está correto ou tente novamente mais tarde.', 'Jogo Não Encontrado')
        }

        const container = new ContainerBuilder()

        container.addMediaGalleryComponents(
            new MediaGalleryBuilder({
                items: [
                    { media: { url: jogo.background_raw } }
                ]
            })
        )

        container.addSeparatorComponents(
            new SeparatorBuilder({
                spacing: SeparatorSpacingSize.Large,
                divider: false
            })
        )

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content:
`# ${jogo.name}

<:moedas:1463846758282170521> ${jogo.is_free
    ? 'Gratuito'
    : jogo.price_overview?.final_formatted || 'Desconhecido'}

**Metacritic:** ${jogo.metacritic ? `[${jogo.metacritic.score}](${jogo.metacritic.url})` : 'Desconecido'}
${jogo.website ? `[Website](${jogo.website})` : 'Desconecido'}

> ${ConversorHtmltoText(jogo.short_description) || 'Nenhuma descrição disponível'}

**Lançamento:** ${
    jogo.release_date.coming_soon
        ? 'Em breve'
        : jogo.release_date.date || 'Desconhecido'
}
**Gêneros:** ${
    jogo.genres?.map(g => g.description).join(', ') || 'Não informado'
}
**Categorias:** ${
    jogo.categories?.slice(0, 10).map(c => c.description).join(', ') || 'Não informado'
}`
            })
        )

        container.addActionRowComponents(
            new ActionRowBuilder().addComponents(
                new ButtonBuilder().setEmoji(`<:foto:1463846754322747497>`).setLabel('Imagens').setStyle(ButtonStyle.Secondary).setCustomId(`games:imagens:${appId}`),
                new ButtonBuilder().setEmoji('<:estatisitcas:1463846753110331537>').setLabel('Requisitos').setStyle(ButtonStyle.Secondary).setCustomId(`games:requisitos:${appId}`),
                new ButtonBuilder().setEmoji('➕').setLabel('Adicionar Sugestão').setStyle(ButtonStyle.Secondary).setCustomId(`games:suggest:${appId}`),
                new ButtonBuilder().setEmoji('<:moedas:1463846758282170521>').setLabel('Comprar').setStyle(ButtonStyle.Link).setURL(`https://store.steampowered.com/app/${appId}`)
            )
        )

        if (!jogo || jogo.length === 0) {
            return interaction.editReply({ content: 'Nenhum jogo encontrado com esse nome.', flags: MessageFlags.Ephemeral })
        }
        addXp(interaction.user.id, 10)
        interaction.editReply({ components: [container], flags: [MessageFlags.IsComponentsV2] })
    }
}