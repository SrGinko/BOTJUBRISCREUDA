const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags } = require('discord.js')
const { useQueue } = require('discord-player')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Pula a música que está tocando atualmente'),

    async execute(interaction) {
        const queue = useQueue(interaction.guild)

        const container = new ContainerBuilder({
            accent_color: 0x3480eb,
        })

        if (!queue) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: 'Não há nenhuma música tocando atualmente!'
                })
            )
        }

        if (!queue.isPlaying()) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: 'Não há nenhuma música tocando atualmente!'
                })
            )
        }

        queue.node.skip()

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: 'Música pulada!'
            })
        )

        await interaction.reply({ components: [container], flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2] })
    }
}