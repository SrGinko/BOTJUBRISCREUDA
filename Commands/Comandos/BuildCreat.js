const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")
const { addXp } = require("../../Controller")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('criarembed')
        .setDescription('Criação de uma Embed')
        .addStringOption(option => option.setName('titulo').setDescription('Adiciona um titulo a sua Incorporção'))
        .addStringOption(option => option.setName('cor').setDescription('A cor em formato HEX(#FF0000)'))
        .addStringOption(option => option.setName('descrição').setDescription('Descrição'))
        .addStringOption(option => option.setName('imagem').setDescription('Insira a URL de uma imagem.'))
        .addBooleanOption(option => option.setName('botao').setDescription('Seleciona se você quer ou não um botão com link na Embed'))
        .addStringOption(option => option.setName('link').setDescription('Insira um link válido')),

    async execute(interaction) {
        const userId = interaction.user.id

        const { options } = interaction

        const title = options.getString('titulo')
        const cor = options.getString('cor') || "Random"
        const descricao = options.getString('descrição') || ''
        const imagem = options.getString('imagem')
        const botao = options.getBoolean('botao') || false
        const link = options.getString('link')

        const Embed = new EmbedBuilder()
            .setTitle(title)
            .setColor(cor)
            .setDescription(descricao)

        const botaoLink = new ButtonBuilder()
            .setLabel('Link')
            .setURL(link)
            .setStyle(ButtonStyle.Link)

        const row = new ActionRowBuilder()
            .addComponents(botaoLink)

        addXp(userId, 20)

        if (imagem === imagem) {
            Embed.setImage(imagem)
        }

        if (botao) {

            await interaction.reply({ embeds: [Embed], components: [row] })

        } else {
            await interaction.reply({ embeds: [Embed] })
        }
    }
}
