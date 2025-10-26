const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('criarmessage')
        .setDescription('Cria uma mensagem para ser enviada a um canal'),

    async execute(interaction) {

        const canais = interaction.guild.channels.cache.filter(c => c.isTextBased())

        console.log(canais)

        const modal = new ModalBuilder({
            title: 'Enviar Mensagem',
            customId: 'criarMessage',
        })
        

        // await interaction.showModal(modal)

    }
}