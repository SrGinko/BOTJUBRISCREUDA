const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('criarembed')
        .setDescription('Criação de uma Embed')
        .addStringOption(option => option.setName('titulo').setDescription('Adiciona um titulo a sua Incorporção'))
        .addStringOption(option => option.setName('cor').setDescription('Selecione uma cor em inglês com a letra inicial maiúscula'))
        .addStringOption(option => option.setName('descrição').setDescription('Descrição'))
        .addStringOption(option => option.setName('imagem').setDescription('Coloque link da imagem para poder carregar'))
        .addStringOption(option => option.setName('thumbnale').setDescription('Coloque um uma thumbnale'))
        .addStringOption(option => option.setName('titulo1').setDescription('Adiciona um título para um determinado assunto'))
        .addStringOption(option => option.setName('assunto1').setDescription('Adicionar um assunto'))
        .addStringOption(option => option.setName('titulo2').setDescription('Adiciona um título para um determinado assunto'))
        .addStringOption(option => option.setName('assunto2').setDescription('Adicionar um assunto'))
        .addStringOption(option => option.setName('titulo3').setDescription('Adiciona um título para um determinado assunto'))
        .addStringOption(option => option.setName('assunto3').setDescription('Adicionar um assunto')),


    async execute(interaction) {

        const { options } = interaction

        const title = options.getString('titulo')
        const cor = options.getString('cor') || "Random"
        const descricao = options.getString('descrição') || ' '
        const imagem = options.getString('imagem') || '\u200B'
        const thumb = options.getString('thumbnale') || '\u200B'
        const title1 = options.getString('titulo1') || '\u200B'
        const assunto1 = options.getString('assunto1') || '\u200B'
        const title2 = options.getString('titulo2') || '\u200B'
        const assunto2 = options.getString('assunto2') || '\u200B'
        const title3 = options.getString('titulo3') || '\u200B'
        const assunto3 = options.getString('assunto3') || '\u200B'


        const constructionEmbed = new EmbedBuilder()
            .setTitle(title)
            .setColor(cor)
            .setDescription(descricao)
            .setImage(imagem)
            .setThumbnail(thumb)
            .setFields(
                { name: title1, value: assunto1, inline: true },
                { name: title2, value: assunto2, inline: true },
                { name: title3, value: assunto3, inline: true }
            )

            await interaction.reply({ embeds: [constructionEmbed]})

    }
}
