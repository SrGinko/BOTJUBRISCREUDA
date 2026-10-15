import { MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { obterUnicoItem } from '../../../service/itensInventario'
import { getBattleByUser } from '../../../RPG/battleManager'
import { renderItemCard } from './render'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loja')
        .setDescription('Veja os detalhes de um item')
        .addStringOption(option => option
            .setName('nome')
            .setDescription('Item para consultar')
            .setAutocomplete(true)
            .setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        if (getBattleByUser(interaction.user.id)) {
            return interaction.reply({
                content: 'Você não pode acessar a loja enquanto está em batalha.',
                flags: MessageFlags.Ephemeral,
            })
        }

        const itemId = Number(interaction.options.getString('nome', true))
        if (!Number.isInteger(itemId) || itemId <= 0) {
            return interaction.reply({ content: 'Selecione um item válido.', flags: MessageFlags.Ephemeral })
        }

        const item = await obterUnicoItem(itemId)
        return interaction.reply({
            components: [renderItemCard(item)],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
        })
    },
}
