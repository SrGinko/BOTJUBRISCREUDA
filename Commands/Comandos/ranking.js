const { SlashCommandBuilder, ContainerBuilder, MediaGalleryBuilder, MessageFlags, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } = require('discord.js')
const { ranking } = require('../../Controller')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ranking')
        .setDescription('Veja o ranking dos melhores!'),

    async execute(interaction) {
        await interaction.deferReply()

        try {

            const attachments = []
            const userRanking = await ranking()
            const container = new ContainerBuilder()

            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `# <:conquista:1463846748052262988> Ranking dos Melhores`,
                })
            )

            container.addSeparatorComponents(
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large,
                    divider: false
                })
            )
            let count = 0

            for (const user of userRanking) {

                if (count >= 5) break

                const attachment = await require('../../Utils/rankingBanner')
                    .createRankingBanner(user, interaction, count + 1)

                if (!attachment) continue

                attachments.push(attachment)

                container.addMediaGalleryComponents(
                    new MediaGalleryBuilder().addItems({
                        media: {
                            url: `attachment://${attachment.name}`
                        }
                    })
                )

                count++
            }

            await interaction.editReply({
                components: [container],
                files: attachments,
                flags: MessageFlags.IsComponentsV2
            })

        } catch (error) {
            console.error(error)
        }
    }
}
