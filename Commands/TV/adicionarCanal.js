const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js')
const { execute } = require('../Comandos/Perfil')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addcanal')
        .setDescription('Adiciona um Canal nos APPs'),

    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('tv:canais')
            .setTitle('Criando Canal')

        const nomeCanalInput = new TextInputBuilder()
            .setCustomId('canalnome')
            .setLabel('Nome do Canal')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Insire aqui')
            .setRequired(true)

        modal.addComponents(
            new ActionRowBuilder().addComponents(nomeCanalInput)
        )

        const canalUrlInput = new TextInputBuilder()
            .setCustomId('canalUrl')
            .setLabel('URL')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Insire aqui')
            .setRequired(true)

        modal.addComponents(
            new ActionRowBuilder().addComponents(canalUrlInput)
        )

        const canalCapaUrlInput = new TextInputBuilder()
            .setCustomId('capaUrl')
            .setLabel('Capa URL')
            .setPlaceholder('Insire aqui')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        modal.addComponents(
            new ActionRowBuilder().addComponents(canalCapaUrlInput)
        )

        await interaction.showModal(modal)

    }
}