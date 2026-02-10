const { SlashCommandBuilder, StringSelectMenuBuilder, ContainerBuilder, TextDisplayBuilder, ActionRowBuilder, MessageFlags } = require("discord.js")
const { BuscarjogoNome } = require("../../Utils/buscarJogos")
const { addXp } = require("../../Utils/xp")

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

            const response = await BuscarjogoNome(nameGame)

            if (response.length > 0) {
                const row = new StringSelectMenuBuilder()
                    .setCustomId('game')
                    .setPlaceholder(`Selecione o jogo`)
                    .addOptions(response.slice(0, 25).map(game => ({
                        label: game.name,
                        value: `${game.name}`,
                        description: game.plataform,
                        emoji: '<:controle:1463846749285257260>'
                    })))

                const container = new ContainerBuilder({
                    accent_color: 0x3c1099,
                    components: [
                        new TextDisplayBuilder({
                            content: `## <:controle:1463846749285257260> Selecione o jogo desejado`,
                            style: 'Short',
                        }),

                        new ActionRowBuilder()
                            .addComponents(row)
                    ]
                })
                addXp(userId, 10)
                await interaction.editReply({ flags: [MessageFlags.IsComponentsV2], components: [container] })
            }

        } catch (error) {
            console.log(error)
        }

    }
}