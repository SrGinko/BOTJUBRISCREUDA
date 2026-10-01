const { useTimeline } = require("discord-player")
const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags } = require("discord.js")
const { container } = require("googleapis/build/src/apis/container")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pausa a música que está tocando atualmente'),

    async execute(interaction) {
        const timeline = useTimeline(interaction.guild)

        const container = new ContainerBuilder({
            accent_color: 0x3480eb,
        })

        if(!timeline){
            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: 'Não há nenhuma música tocando atualmente!'
                })
            ) 

            return await interaction.reply({components: [container], flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]})
        }

        const wasPaused = timeline.paused

        wasPaused ? timeline.resume() : timeline.pause()

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: wasPaused ? 'Música resumida!' : 'Música pausada!'
            })
        )

        await interaction.reply({components: [container], flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]})
    }
}