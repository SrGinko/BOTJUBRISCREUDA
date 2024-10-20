const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('criarembed')
        .setDescription('Criação de uma Embed')
        .addStringOption(option => option.setName('titulo').setDescription('Adiciona um titulo a sua Incorporção'))
        .addStringOption(option => option.setName('cor').setDescription('A cor em formato HEX(#FF0000)'))
        .addStringOption(option => option.setName('descrição').setDescription('Descrição'))
        .addStringOption(option => option.setName('imagem').setDescription('Insira a URL de uma imagem.')),

    async execute(interaction) {

        const { options } = interaction

        const title = options.getString('titulo')
        const cor = options.getString('cor') || "Random"
        const descricao = options.getString('descrição') || ''
        const imagem = options.getString('imagem')

        const Embed = new EmbedBuilder()
            .setTitle(title)
            .setColor(cor)
            .setDescription(descricao)

        if (imagem == imagem) {
            Embed.setImage(imagem)
        }

        await interaction.reply({ embeds: [Embed] })

    }
}
