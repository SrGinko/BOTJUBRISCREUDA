const { SlashCommandBuilder, ModalBuilder, ContainerBuilder, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, ActionRowBuilder, ButtonStyle, ButtonBuilder, MessageFlags, TextDisplayBuilder, ThumbnailBuilder } = require("discord.js")
const { obterUnicoItem } = require("../../Utils/itensInventario")
const { criarEmbed } = require("../../Utils/embedFactory")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('loja')
        .setDescription("Busca informações de um item")
        .addStringOption(options => options.setName('nome').setDescription('Nome do item').setAutocomplete(true).setRequired(true)),

    async execute(interaction) {
        const itemID = parseInt(interaction.options.getString('nome'))

        if (Number.isNaN(itemID)) {
            return
        }

        const item = await obterUnicoItem(itemID)

        let cor
        if (item.raridade === 'COMUM') {
            cor = 0x00FF00
        } else if (item.raridade === 'RARA') {
            cor = 0x0095ff
        } else if (item.raridade === 'EPICA') {
            cor = 0x8400ff
        } else if (item.raridade === 'LENDARIA') {
            cor = 0xFF4500
        }
        const container = new ContainerBuilder(
            {
                accent_color: cor
            }
        )

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`loja:comprar:${itemID}`).setLabel('Comprar').setStyle(ButtonStyle.Success),
        )

        if (item.imagem) {

            container.addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder({
                            content: `# ${item.nome} \n\n  >>> ${item.descricao}`
                        }))
                    .setThumbnailAccessory(
                        new ThumbnailBuilder({
                            media: { url: item.imagem }
                        })
                    )
            )
        } else {
            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `# ${item.nome} \n\n  >>> ${item.descricao}`
                }))
        }
        
        container.addSeparatorComponents(
            new SeparatorBuilder({
                spacing: SeparatorSpacingSize.Small,
                divider: false
            })
        )

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: `### Informações do Item: \n **Raridade:** ${item.raridade} \n **Tipo:** ${item.tipo} \n **Valor:** ${item.preco} moedas`
            })
        )

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: `### Atributos: \n ${item.heal ? `**❤️ Vida:** ${item.heal} \n` : ''} ${item.ataque ? `**⚔️ Ataque:** ${item.ataque} \n` : ''} ${item.defesa ? `**🛡️ Defesa:** ${item.defesa} \n` : ''}`
            })
        )

        container.addSeparatorComponents(
            new SeparatorBuilder({
                spacing: SeparatorSpacingSize.Small,
                divider: true
            })
        )

        container.addActionRowComponents(row)

        await interaction.reply({ components: [container], flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2] })
    },

}