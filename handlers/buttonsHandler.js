const { MessageFlags, LabelBuilder, ModalBuilder, ComponentType } = require('discord.js')
const { api } = require('../service/axiosClient')
const { handleRpgButton } = require('../RPG/handlers/buttons')
const banners = require('../data/banners')

async function handleActionButton(customId, user, interaction) {
    const [prefix, action, userId, battleId] = customId.split(':')

    if (prefix === 'rpgduel' || prefix === 'rpg') return handleRpgButton(interaction)

    if (prefix === 'loja') return handleRpgButton(interaction)

    if (prefix === 'system') {
        if (action === 'alterar_banner') {
            const modal = new ModalBuilder({
                title: 'Alterar Banner',
                customId: `system:alterarBanner:${userId}`,
            })
                .addLabelComponents(
                    new LabelBuilder({
                        label: 'Banner:',
                        description: 'Selecione o banner que deseja usar',
                        component: {
                            type: ComponentType.StringSelect,
                            custom_id: "banner",
                            options: banners.map(banner => ({
                                label: banner.name,
                                value: banner.id
                            }))
                        }
                    })
                )

            await interaction.showModal(modal)

        } if (action === 'verheroi') {

            await interaction.deferUpdate()

            const wallpaperIndex =
                await api.get(`/usuario/${userId}`)
                    .then(res => res.data.wallpaper)
                    .catch(err => {
                        console.error(err)
                        return 0
                    })

            const { conteiner, attachment } =
                await require('../Utils/utilsPerfil')
                    .creatPerfil(userId, wallpaperIndex, interaction, 'heroi')

            await interaction.editReply({
                files: [attachment],
                components: [conteiner],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            })
        } if (action === 'verusuario') {
            await interaction.deferUpdate()

            const wallpaperIndex =
                await api.get(`/usuario/${userId}`)
                    .then(res => res.data.wallpaper)
                    .catch(err => {
                        console.error(err)
                        return 0
                    })

            const { conteiner, attachment } =
                await require('../Utils/utilsPerfil')
                    .creatPerfil(userId, wallpaperIndex, interaction, 'usuario')

            await interaction.editReply({
                files: [attachment],
                components: [conteiner],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            })
        }
    }
    return { ok: true }
}

module.exports = { handleActionButton }
