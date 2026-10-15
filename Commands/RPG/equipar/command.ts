import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { obterItensInventario } from '../../../service/itensInventario'
import { renderEquipmentModal } from './render'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('equipar')
        .setDescription('Equipe itens do seu herói'),

    async execute(interaction: ChatInputCommandInteraction) {
        const inventory = await obterItensInventario(interaction.user.id)
        await interaction.showModal(renderEquipmentModal(interaction.user.id, inventory))
    },
}
