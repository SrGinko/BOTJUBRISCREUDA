import {
    ComponentType,
    ContainerBuilder,
    LabelBuilder,
    MessageFlags,
    ModalBuilder,
    TextDisplayBuilder,
    type ButtonInteraction,
} from 'discord.js'
import { api } from '../service/axiosClient'
import { handleRpgButton } from '../RPG/handlers/buttons'
import { Banner, banners } from '../data/banners'
import { creatPerfil } from '../Utils/utilsPerfil'
import { handleHydraButton } from './hydraHandler'

export async function handleActionButton(customId: string, interaction: ButtonInteraction) {
    if (customId.startsWith('hydra:')) {
        await handleHydraButton(interaction)
        return { ok: true }
    }

    const [prefix, action, userId] = customId.split(':')

    if (prefix === 'rpgduel' || prefix === 'rpg' || prefix === 'loja') {
        return handleRpgButton(interaction)
    }

    if (prefix === 'system') {
        if (action === 'alterar_banner') {
            const modal = new ModalBuilder({
                title: 'Alterar Banner',
                customId: `system:alterarBanner:${userId}`,
            }).addLabelComponents(
                new LabelBuilder({
                    label: 'Banner:',
                    description: 'Selecione o banner que deseja usar',
                    component: {
                        type: ComponentType.StringSelect,
                        custom_id: 'banner',
                        options: banners.map((banner: Banner) => ({
                            label: banner.name,
                            value: banner.id,
                        })),
                    },
                }),
            )

            await interaction.showModal(modal)
            return { ok: true }
        }

        if (action === 'verheroi' || action === 'verusuario') {
            const profileType = action === 'verheroi' ? 'heroi' : 'usuario'
            await interaction.update({
                components: [
                    new ContainerBuilder().addTextDisplayComponents(
                        new TextDisplayBuilder({
                            content: profileType === 'heroi'
                                ? '⏳ Carregando perfil do herói...'
                                : '⏳ Carregando perfil do usuário...',
                        }),
                    ),
                ],
                flags: MessageFlags.IsComponentsV2,
            })

            const { data } = await api.get<{ wallpaper?: number }>(`/usuario/${userId}`)
            const wallpaperIndex = data.wallpaper ?? 0
            const perfil = await creatPerfil(userId, wallpaperIndex, interaction, profileType)
            if (!perfil) return { ok: true }

            await interaction.editReply({
                files: [perfil.attachment],
                components: [perfil.conteiner],
                flags: MessageFlags.IsComponentsV2,
            })
            return { ok: true }
        }
    }

    return { ok: true }
}
