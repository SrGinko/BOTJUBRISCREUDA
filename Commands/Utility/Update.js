const { SlashCommandBuilder } = require("discord.js")
const { atualizarMine, atualizarStardew } = require('../../Controle')
const adm = '770818264691114016'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Update de links, somente administradores podem usar esse comando')
        .addStringOption(option => option.setName('minecraft').setDescription('Altera o link de download do Minecraft'))
        .addStringOption(option => option.setName('stardew').setDescription('Altera o link de download do Stardew Valley')),

    async execute(interaction) {

        const { options } = interaction

        const minecraft1 = options.getString('minecraft')
        const stardew1 = options.getString('stardew')

        if (interaction.user.id !== adm) {
            await interaction.reply({ content: `Você não tem permissão para dar este comando`, ephemeral: true })
        } else {
            atualizarMine(minecraft1)
            atualizarStardew(stardew1)
            await interaction.reply({ content: `${stardew1}`, ephemeral: true })
        }
    }
}
