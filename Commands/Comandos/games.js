const { SlashCommandBuilder, StringSelectMenuBuilder, ContainerBuilder, TextDisplayBuilder, ActionRowBuilder, MessageFlags, Message } = require("discord.js")
const { Buscarjogo  } = require("../../Controller")
const { addXp } = require("../../Utils/xp")
const { icone } = require("../../Utils/emojis")
const emojisData = require("../../data/emojis")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('games')
        .setDescription('Busca algumas informações de um determinado jogo')
        .addStringOption(option => option.setName('game').setDescription('Insira o nome do jogo').setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply()

        const { options } = interaction
        const userId = interaction.user.id

        const nameGame = options.getString('game')

        try {

            const response = await Buscarjogo(nameGame)

            if (response.length > 0) {
                const row = new StringSelectMenuBuilder()
                    .setCustomId('game')
                    .setPlaceholder(`Selecione o jogo`)
                    .addOptions(response.slice(0, 25).map(game => ({
                        label: game.name,
                        value: `${game.name}`,
                        description: game.plataform,
                        emoji: '🎮'
                    })))

                const container = new ContainerBuilder({
                    accent_color: 0x3c1099,
                    components: [
                        new TextDisplayBuilder({
                            content: `## Selecione o jogo desejado`,
                            style: 'Short',
                        }),

                        new ActionRowBuilder()
                            .addComponents(row)
                    ]
                })
                addXp(userId, 10)
                await interaction.editReply({ flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] , components: [container] })
            }

        } catch (error) {
            console.log(error)
        }

    }
}