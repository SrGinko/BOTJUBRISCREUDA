const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js')
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const { URL } = process.env

const API_MONTEIR_KEY = process.env.API_MONTEIR_KEY


const embed = new EmbedBuilder()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('criarheroi')
        .setDescription('Crie seu herói')
        .addStringOption(option => option.setName('nome').setDescription('Nome do seu herói').setAutocomplete(true).setRequired(true)),

    async execute(interaction) {
        const { options } = interaction
        const userId = interaction.user.id

        const heroiName = options.getString('nome')

        await axios.post(`${URL}/heroes`, {
            nome: heroiName,
            userID: userId

        }, {
            headers: {
                apikey: API_MONTEIR_KEY
            }

        }).then(() => {
            embed.setTitle("Heroi Criado com Sucesso! ✅")
            embed.setColor('Green')
            embed.setTimestamp()

        }).catch((error) => {
            embed.setTitle(`Erro ao criar herói! ${error.response.data.message} 🚫`)
            embed.setColor('Red')
            embed.setTimestamp()

            console.log(error.response.data.message)
        })

        embed.setFooter({ text: 'By Jubriscreuda', iconURL: 'https://i.ytimg.com/vi/s6V4BjURhOs/maxresdefault.jpg' })
        add(userId, 100)
        await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] })
    }
} 
