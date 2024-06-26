const { SlashCommandBuilder, EmbedBuilder, Colors, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('createbuild')
        .setDescription('Criação de uma Embed que contem informações da Builld')
        .addStringOption(option => option.setName('titulo').setDescription('Adiciona um titulo a sua Incorporção').setRequired(true))
        .addStringOption(option => option.setName('imagem').setDescription('Adiciona uma imagem a Incorporação (Obrigatoriamente tem que ser um link https)').setRequired(true))
        .addStringOption(option => option.setName('cor').setDescription('Selecione uma cor em inglês com a letra inicial maiúscula'))
        .addStringOption(option => option.setName('link').setDescription('Coloque o link para o acesso da build')),

    async execute(interaction) {

        const { options } = interaction

        const title = options.getString('titulo')
        const image = options.getString('imagem')
        const cor = options.getString('cor') || "Random"
        const link = options.getString('link') || "https://www.mediafire.com/file/mj7mjo21debfkhk/Meme_Buttons_1.7.1_Apkpure.apk/file"

        const constructionEmbed = new EmbedBuilder()
            .setTitle(title)
            .setImage(image)
            .setColor(cor)

        const button = new ButtonBuilder()
            .setLabel('Link')
            .setURL(link)
            .setStyle(ButtonStyle.Link)

        const buttonBuilder = new ActionRowBuilder()
            .addComponents(button)

        if(link == "https://www.mediafire.com/file/mj7mjo21debfkhk/Meme_Buttons_1.7.1_Apkpure.apk/file"){
            await interaction.reply({embeds: [constructionEmbed] })
        }else{
            await interaction.reply({embeds: [constructionEmbed], components:[buttonBuilder]})
        }
        
    }
}
