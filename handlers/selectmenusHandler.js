const { ContainerBuilder, TextDisplayBuilder, MessageFlags, MediaGalleryBuilder, SectionBuilder, ThumbnailBuilder, hyperlink, ActionRowBuilder, ButtonBuilder, ButtonStyle, SeparatorBuilder, SeparatorSpacingSize } = require('discord.js')
const { api } = require('../Utils/axiosClient')
const { formatDate } = require('../Utils/date')
const { addXp } = require('../Utils/xp')
const { obterUnicoItem } = require('../Utils/itensInventario')
const hydraLinks = require('../data/hydraLinks')
const { BuscarjogoNome, BuscarjogoId } = require('../Utils/buscarJogos')

async function SelectMenusHandleAction(interaction) {
    const userId = interaction.user.id
    const idMenu = interaction.customId

    switch (idMenu) {
        case 'server': {
            const server = interaction.values[0]

            switch (server) {
                case 'java':
                    embed.setColor('Green')
                    embed.setDescription('Servidor Minecraft Java')
                    embed.setFields(
                        { name: 'Servidor', value: 'manicomio.minecrafthost.com.br' },
                    )

                    return await interaction.reply({ embeds: [embed] })
                    break

                case 'bedrock':
                    embed.setColor('Green')
                    embed.setDescription('Servidor Minecraft Bedrock')
                    embed.setFields(
                        { name: 'Servidor', value: 'valk.lura.pro' },
                        { name: 'Porta', value: '35606' }
                    )
                    return await interaction.reply({ embeds: [embed] })
                    break
            }

        }
            break

        case 'hydra': {
            const id = interaction.values
            let item

            if (id.includes('todos')) {
                item = hydraLinks.slice(1)
            } else {
                item = hydraLinks.filter(item => id.includes(item.id))
            }


            if (item.length > 0) {
                const container = new ContainerBuilder({
                    accent_color: 0xffffff
                })

                container.addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder({
                                content: `# <:hydra:1463850338967621633> HydraLauncher
- Link de Download da HydraLauncher ${hyperlink('Clique aqui', 'https://github.com/hydralauncher/hydra/releases/')}
- Tutorial de como Instalar ${hyperlink('Clique aqui', 'https://youtu.be/Yo9fka6A6RE?si=zSjO1txthuQsFcjU')}
`
                            })
                        )
                        .setThumbnailAccessory(
                            new ThumbnailBuilder({
                                media: { url: 'https://github.com/hydralauncher/hydra/raw/main/resources/icon.png' }
                            })
                        )
                )

                container.addSeparatorComponents()

                item.forEach(element => {
                    container.addTextDisplayComponents(
                        new TextDisplayBuilder({
                            content: `**${element.name}:** \`\`\`${element.link}\`\`\``
                        })
                    )
                })

                await interaction.update({ flags: [MessageFlags.IsComponentsV2], components: [container] })

            } else {
                await interaction.update({ content: 'Nenhum jogo encontrado.', flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })
            }
        }
            break;

        case 'equipar-item': {
            const itemId = interaction.values
            itemId.map(async id => {
                let itens = await obterUnicoItem(+id)

                switch (itens.tipo) {
                    case 'ARMA':
                        api.patch(`heroes/${userId}`, {
                            armaID: itens.id
                        })

                        const container = new ContainerBuilder({
                            accent_color: 0x00ff2a,
                            components: [
                                new TextDisplayBuilder({
                                    content: 'Arma equipada com sucesso.'
                                })
                            ]
                        })

                        api.patch(`heroes/${userId}/inventario/remover`, {
                            itemID: itens.id,
                            quantidade: 1
                        })

                        interaction.update({ components: [container] })
                        break
                    case 'ARMADURA':
                        api.patch(`heroes/${userId}`, {
                            armaduraID: itens.id
                        })
                        interaction.update({ content: 'Armadura equipada com sucesso.' })
                        break
                    case 'CALCA':
                        api.patch(`heroes/${userId}`, {
                            calcaID: itens.id
                        })
                        interaction.update({ content: 'Calca equipada com sucesso.' })
                        break
                    default:
                        interaction.update({ content: 'Item não equipável.' })
                        break
                }
            })
        }

            break;
    }
}

module.exports = { SelectMenusHandleAction }