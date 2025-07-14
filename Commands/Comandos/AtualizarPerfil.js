const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js")
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()
const { URL_USUARIO } = process.env

const embed = new EmbedBuilder()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('attperfil')
        .setDescription('Atualiza o perfil')
        .addStringOption(option => option.setName('descricao').setDescription('Descrição do seu Perfil'))
        .addStringOption(option => option.setName('gifimagem').setDescription('GIF/Imagem de Thumbnail do seu Perfil (Adicione uma URL Válida)')),

    async execute(interaction) {

        const { options } = interaction
        const userId = interaction.user.id

        const response = await axios.get(`${URL_USUARIO}/${userId}`)
        const user = response.data

        const descricao = options.getString('descricao') || user.Descricao || 'Sem descrição'
        const gifImage = options.getString('gifimagem') || user.foto || interaction.user.displayAvatarURL({ extension: 'png' })

        try {

            await axios.patch(`${URL_USUARIO}/${userId}`, {
                Descricao: descricao,
                foto: gifImage
            }).then(() => {
                embed.setDescription('Perfil Atualizado com Sucesso')
                embed.setColor('Green')
                embed.setTimestamp()
            })

            await interaction.reply({embeds: [embed], flags: [MessageFlags.Ephemeral]})

        } catch (error) {
            console.log(error)
        }
    }
}
