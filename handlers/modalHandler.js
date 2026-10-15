const { ContainerBuilder, TextDisplayBuilder, MessageFlags, SeparatorBuilder, SeparatorSpacingSize } = require('discord.js')
const { criarEmbed } = require('../Utils/embedFactory')
const { api } = require('../service/axiosClient')
const { handleRpgModal } = require('../RPG/handlers/modals')

async function ModalHandleAction(interaction) {
    const [prefix, action, id, battleId] = interaction.customId.split(':')
    if (prefix === 'rpg') return handleRpgModal(interaction)

    if (prefix === 'tv') {
        switch (action) {
            case 'addcanal': {
                const nomeCanal = interaction.fields.getTextInputValue('canalNome')
                const canalUrl = interaction.fields.getTextInputValue('canalUrl')
                const capaCanal = interaction.fields.getTextInputValue('capaUrl')

                api.post('/tv/canais', {
                    nome: nomeCanal,
                    url: canalUrl,
                    capaUrl: capaCanal
                })

                interaction.reply({
                    embeds: [
                        criarEmbed({
                            description: 'Encaminhado dados !',
                            color: 'Green'
                        })
                    ],
                    flags: 64
                })

                const channel = await interaction.guild.channels.fetch('1428656070552850483')
                guildEvent.emit('addcanal', { nomeCanal, CapaCanal: capaCanal, channel })
                break
            }
            default:
                break
        }
    } else if (prefix === 'system') {
        switch (action) {
            case 'criarmensagem': {
                const titulo = interaction.fields.getTextInputValue('titulo')
                const conteudo = interaction.fields.getTextInputValue('conteudo')
                const canal = interaction.fields.getStringSelectValues('canaltexto')

                const channel = await interaction.guild.channels.fetch(canal[0])

                const container = new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder({
                            content: `# ${titulo}`
                        })
                    )
                    .addSeparatorComponents(
                        new SeparatorBuilder({
                            spacing: SeparatorSpacingSize.Large,
                            divider: true
                        })
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder({
                            content: conteudo
                        })
                    )

                await channel.send({ components: [container], flags: [MessageFlags.IsComponentsV2] })
                break
            }

            case 'alterarBanner': {
                const bannerId = parseInt(interaction.fields.getStringSelectValues('banner'))
                await interaction.deferReply({ flags: [MessageFlags.Ephemeral] })

                api.patch(`/usuario/${id}`, {
                    wallpaper: bannerId
                })

                const { conteiner, attachment } = await require('../Utils/utilsPerfil').creatPerfil(interaction.user.id, bannerId, interaction, 'usuario')

                await interaction.editReply({
                    components: [conteiner],
                    files: [attachment],
                    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
                })
                break
            }

            default:
                break
        }
    }
}

module.exports = { ModalHandleAction }
