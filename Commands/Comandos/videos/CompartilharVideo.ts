import {
    ChannelType,
    ContainerBuilder,
    MediaGalleryBuilder,
    MessageFlags,
    SlashCommandBuilder,
    TextDisplayBuilder,
    ModalBuilder,
    LabelBuilder,
    type ChatInputCommandInteraction,
    ComponentType,
    TextInputStyle,
} from 'discord.js'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('compartilharvideos')
        .setDescription('Compartilha um vídeo que você tem autorização para publicar'),

    async execute(interaction: ChatInputCommandInteraction) {

        const channelsTexts = interaction.guild?.channels.cache.filter(channel =>
            channel.type === ChannelType.GuildText ||
            channel.type === ChannelType.GuildForum
        );
        const modal = new ModalBuilder({
            title: 'Compartilhar Vídeo',
            customId: `system:compartilharvideo:${interaction.user.id}`,
        })

        modal.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: 'Insira as informações solicitadas que serão compartilhadas no canal desejado.'
            })
        )

        modal.addLabelComponents(
            new LabelBuilder({
                label: 'URL do Vídeo:',
                description: 'Insira a URL do vídeo que deseja compartilhar',
                component: {
                    type: ComponentType.TextInput,
                    style: TextInputStyle.Short,
                    custom_id: "video-url",
                    required: false,
                }
            })
        )

        modal.addLabelComponents(
            new LabelBuilder({
                label: 'Descrição do Vídeo:',
                description: 'Insira uma descrição para o vídeo que deseja compartilhar',
                component: {
                    type: ComponentType.TextInput,
                    style: TextInputStyle.Paragraph,
                    custom_id: "video-description",
                    required: false,
                }
            })
        )

        modal.addLabelComponents(
            new LabelBuilder({
                label: "Canal:",
                description: "Selecione qual canal de texto",
                component: {
                    type: ComponentType.StringSelect,
                    custom_id: 'canaltexto',
                    required: true,
                    options: channelsTexts?.map((ch: any) => (
                        { label: `${ch.name}`, value: `${ch.id}` }
                    )).slice(0, 25) ?? []
                }
            })
        )

        await interaction.showModal(modal)
    },
}
