const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('criarembed')
        .setDescription('Criação de uma Embed')
        .addStringOption(option => option.setName('titulo').setDescription('Adiciona um titulo a sua Incorporção'))
        .addStringOption(option => option.setName('cor').setDescription('Selecione uma cor em inglês com a letra inicial maiúscula'))
        .addStringOption(option => option.setName('descrição').setDescription('Descrição')),

    async execute(interaction) {

        const { options } = interaction

        const title = options.getString('titulo')
        const cor = options.getString('cor') || "Random"
        const descricao = options.getString('descrição') || ' '



        const constructionEmbed = new EmbedBuilder()
            .setTitle(title)
            .setColor(cor)
            .setDescription(descricao)
        await interaction.reply({ embeds: [constructionEmbed] })

    }
}
