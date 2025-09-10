const { SlashCommandBuilder, MessageFlags, ContainerBuilder, StringSelectMenuBuilder, ActionRowBuilder, TextDisplayBuilder, ThumbnailBuilder, SectionBuilder } = require('discord.js')
const { obterItensInventario } = require('../../Utils/itensInventario')
const { getRandonCores } = require('../../Utils/cores')



module.exports = {
    data: new SlashCommandBuilder()
        .setName('equipar')
        .setDescription('Equipa os Itens equipaveis no seu heroi'),

    async execute(interaction) {
        const userId = interaction.user.id

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] })

        const inventario = await obterItensInventario(userId)
        const itensEquipaveis = inventario.filter(itens => {
            if (itens.tipo === 'ARMA')
                return itens
        })

        const row = new StringSelectMenuBuilder()
            .setCustomId('equipar-item')
            .setPlaceholder('Selecione o Item')
            .setMinValues(1)
            .setMaxValues(3)
            .setMaxValues(itensEquipaveis.length)
            .addOptions(itensEquipaveis.map(item => ({
                label: item.nome,
                value: item.id.toString(),
                description: item.descricao
            })))

        const cor = getRandonCores()

        const container = new ContainerBuilder({
            accent_color: cor,
        })

        container.addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder({
                        content: `# Itens Equipavéis

Itens do seu inventário que você consegue equipar.
`
                    })
                )
                .setThumbnailAccessory(
                    new ThumbnailBuilder({
                        media: { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLfvPLuVKPLsnKo5ctuubhKKtCClyUfIytyA&s' }
                    })
                )
        )

        container.addActionRowComponents(
            new ActionRowBuilder()
                .addComponents(row)
        )

        await interaction.editReply({ flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral], components: [container] })
    }
}
