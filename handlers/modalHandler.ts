import {
    ContainerBuilder,
    MessageFlags,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder,
    type ModalSubmitInteraction,
} from 'discord.js'
import { criarEmbed } from '../Utils/embedFactory'
import { api } from '../service/axiosClient'
import { handleRpgModal } from '../RPG/handlers/modals'
import { creatPerfil } from '../Utils/utilsPerfil'
import guildEvent from '../Events/GuildEvent'
import CompartilharVideosHandle from '../Commands/Comandos/videos/CompartilharVideosHandle'

export async function ModalHandleAction(interaction: ModalSubmitInteraction): Promise<void> {
    const [prefix, action, id] = interaction.customId.split(':')
    if (prefix === 'rpg') {
        await handleRpgModal(interaction)
        return
    }

    if (prefix === 'tv' && action === 'addcanal') {
        const nomeCanal = interaction.fields.getTextInputValue('canalNome')
        const canalUrl = interaction.fields.getTextInputValue('canalUrl')
        const capaCanal = interaction.fields.getTextInputValue('capaUrl')
        const guild = interaction.guild
        if (!guild) {
            await interaction.reply({ content: 'Este formulário só pode ser usado em um servidor.', flags: MessageFlags.Ephemeral })
            return
        }

        await api.post('/tv/canais', {
            nome: nomeCanal,
            url: canalUrl,
            capaUrl: capaCanal,
        })

        await interaction.reply({
            embeds: [criarEmbed({ description: 'Encaminhado dados !', color: 'Green' })],
            flags: MessageFlags.Ephemeral,
        })

        const channel = await guild.channels.fetch('1428656070552850483')
        if (!channel?.isTextBased() || !channel.isSendable()) {
            throw new Error('Canal configurado para publicar canais de TV não está disponível.')
        }
        guildEvent.emit('addcanal', { nomeCanal, CapaCanal: capaCanal, channel })
        return
    }

    if (prefix !== 'system') return

    if (action === 'criarmensagem') {
        const titulo = interaction.fields.getTextInputValue('titulo')
        const conteudo = interaction.fields.getTextInputValue('conteudo')
        const canalId = interaction.fields.getStringSelectValues('canaltexto')[0]
        const guild = interaction.guild
        if (!guild || !canalId) {
            await interaction.reply({ content: 'Selecione um canal válido em um servidor.', flags: MessageFlags.Ephemeral })
            return
        }

        const channel = await guild.channels.fetch(canalId)
        if (!channel?.isTextBased() || !channel.isSendable()) {
            await interaction.reply({ content: 'O canal selecionado não está disponível para mensagens.', flags: MessageFlags.Ephemeral })
            return
        }

        const container = new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder({ content: `# ${titulo}` }))
            .addSeparatorComponents(
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large,
                    divider: true,
                }),
            )
            .addTextDisplayComponents(new TextDisplayBuilder({ content: conteudo }))

        await channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
        await interaction.reply({ content: 'Mensagem enviada com sucesso.', flags: MessageFlags.Ephemeral })
        return
    }

    if (action === 'alterarBanner') {
        const bannerId = Number(interaction.fields.getStringSelectValues('banner')[0])
        if (!Number.isInteger(bannerId) || bannerId < 0) {
            await interaction.reply({ content: 'Selecione um banner válido.', flags: MessageFlags.Ephemeral })
            return
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral })
        await api.patch(`/usuario/${id}`, { wallpaper: bannerId })
        const perfil = await creatPerfil(interaction.user.id, bannerId, interaction, 'usuario')
        if (!perfil) return

        await interaction.editReply({
            components: [perfil.conteiner],
            files: [perfil.attachment],
            flags: MessageFlags.IsComponentsV2,
        })
    }

    if (action === 'compartilharvideo') {
        CompartilharVideosHandle(interaction.customId, interaction)
    }
}
