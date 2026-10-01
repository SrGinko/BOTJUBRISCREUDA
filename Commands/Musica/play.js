const { SlashCommandBuilder, ContainerBuilder, SectionBuilder, TextDisplayBuilder, MessageFlags, ThumbnailBuilder, SeparatorSpacingSize, SeparatorBuilder } = require('discord.js');
const { handleError } = require('../../handlers/errorsHandler');
const { useMainPlayer } = require('discord-player');
const client = require('../..');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Toca uma música a partir de um link ou nome da música')
        .addStringOption(options => options.setName('query').setDescription('Link ou nome da música').setRequired(true)),

    async execute(interaction) {
        const query = interaction.options.getString('query');
        const channel = interaction.member.voice.channel;
        const player = interaction.client.player;

        const container = new ContainerBuilder({
            accent_color: 0x3480eb,
        })

        if (!channel) {
            return handleError(interaction, 'Você precisa estar em um canal de voz para usar este comando!', 'Erro ao dar Play');
        }

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction,
                }
            });

            console.log(track)

           const hiperLink = `[${track.title}](${track.url})`

            container.addSectionComponents(
                new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder({
                        content: `### Adicionada à fila: **${hiperLink}**! \n Descrição: **${track.description}** \n Duração: **${track.duration}** \n Autor: **${track.author}**`,
                    })
                )
                .setThumbnailAccessory(
                    new ThumbnailBuilder({
                        media:{
                            url: track.thumbnail
                        }
                    })
                )
            )

            container.addSeparatorComponents(
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large,
                    divider: false
                })
            )

            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `> Jubiscreuda Music`
                })
            )

            await interaction.editReply({components: [container], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]})

        } catch (error) {
            console.error(error);
            return handleError(interaction, 'Ocorreu um erro ao tentar tocar a música. Por favor, tente novamente mais tarde.', 'Erro ao dar Play');
        }
    }
}