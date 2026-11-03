import { SlashCommandBuilder, MessageFlags, type ChatInputCommandInteraction } from 'discord.js'
import { BuscarjogoId } from '../../service/buscarJogos'
import { addXp } from '../../Utils/xp'
import { handleError } from '../../handlers/errorsHandler'
import { criarGameInfoViewer } from './gamesRenderer'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('games')
        .setDescription('Busca informações de um determinado jogo')
        .addStringOption(option =>
            option
                .setName('game')
                .setDescription('Insira o nome do jogo')
                .setAutocomplete(true)
                .setRequired(true),
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()

        const appId = interaction.options.getString('game')
        if (!appId) {
            return handleError(interaction, 'Selecione um jogo válido.', 'Jogo inválido')
        }

        const jogo = await BuscarjogoId(appId)
        if (!jogo) {
            return handleError(
                interaction,
                'Não foi possível encontrar informações sobre esse jogo. Verifique se o nome está correto ou tente novamente mais tarde.',
                'Jogo não encontrado',
            )
        }

        void addXp(interaction.user.id, 10).catch(console.error)
        return interaction.editReply({
            components: [criarGameInfoViewer(jogo, appId)],
            flags: [MessageFlags.IsComponentsV2],
        })
    },
}
