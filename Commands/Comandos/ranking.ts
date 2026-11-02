import {ContainerBuilder, MediaGalleryBuilder, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, SlashCommandBuilder,TextDisplayBuilder, type ChatInputCommandInteraction} from 'discord.js'
import ranking from '../../service/ranking'
import { createRankingBanner } from '../../Utils/rankingBanner'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ranking')
        .setDescription('Veja o ranking dos melhores!'),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()

        try {
            const attachments = []
            const userRanking = await ranking()
            const container = new ContainerBuilder()

            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: '# <:conquista:1463846748052262988> Ranking dos Melhores',
                }),
            )

            container.addSeparatorComponents(
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large,
                    divider: false,
                }),
            )

            let count = 0
            for (const user of userRanking) {
                if (count >= 10) break

                const attachment = await createRankingBanner(user, interaction, count + 1)
                if (!attachment) continue

                attachments.push(attachment)
                container.addMediaGalleryComponents(
                    new MediaGalleryBuilder().addItems({
                        media: { url: `attachment://${attachment.name}` },
                    }),
                )
                count++
            }

            await interaction.editReply({
                components: [container],
                files: attachments,
                flags: MessageFlags.IsComponentsV2,
            })
        } catch (error) {
            console.error(error)
        }
    },
}
