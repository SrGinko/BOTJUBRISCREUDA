const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js')
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const { URL, API_MONTEIR_KEY } = process.env

const embed = new EmbedBuilder()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('criaritens')
        .setDescription('Comando para Criar Itens')
        .addStringOption(option => option.setName('nomeitem').setDescription('Nome do Item').setRequired(true))
        .addStringOption(option => option.setName('descriçãoitem').setDescription('Descrição do Item').setRequired(true))
        .addStringOption(option => option.setName('raridade').setDescription('Raridade deste Item').setChoices(
            { name: 'Comum', value: 'COMUM' },
            { name: 'Rara', value: 'RARA' },
            { name: 'Epico', value: 'EPICO' },
            { name: 'Lendário', value: 'LENDARIO' },
        ).setRequired(true))
        .addStringOption(option => option.setName('tipo').setDescription('Tipo do Item').setRequired(true).setChoices(
            { name: 'Armadura', value: 'ARMADURA' },
            { name: 'Calça', value: 'CALCA' },
            { name: 'Arma', value: 'ARMA' },
            { name: 'Consumivel', value: 'CONSUMIVEL' },
            { name: 'Outro', value: 'OUTRO' },
        ))
        .addIntegerOption(option => option.setName('valor').setDescription('Valor do item').setRequired(true))
        .addIntegerOption(option => option.setName('ataque').setDescription('Define o valor de dano do item caso necessário'))
        .addIntegerOption(option => option.setName('defesa').setDescription('Define o valor de defesa do item caso necessário'))
        .addIntegerOption(option => option.setName('heal').setDescription('Define o valor bonus do item caso necessário'))
        .addIntegerOption(option => option.setName('imagem').setDescription('adiciona imagem ao item EXP(http)')),

    async execute(interaction) {
        const { options } = interaction
        const userId = interaction.user.id

        try {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] })

            const nomeItem = options.getString('nomeitem')
            const descicaoItem = options.getString('descriçãoitem')
            const raridade = options.getString('raridade')
            const tipo = options.getString('tipo')
            const valor = options.getInteger('valor')
            const ataque = options.getInteger('ataque')
            const defesa = options.getInteger('defesa')
            const heal = options.getInteger('heal')
            const imagem = options.getString('imagem')


            await axios.post(`${URL}/itens`, {
                nome: nomeItem,
                descricao: descicaoItem,
                raridade,
                tipo,
                preco: valor,
                imagem,
                ataque,
                defesa,
                heal

            }, {
                headers: {
                    apikey: API_MONTEIR_KEY
                }
            })

            embed.setTitle("Item criando com sucesso! ✅")
            embed.setColor('Green')
            embed.setTimestamp()

        } catch (error) {

            embed.setTitle(`Erro ao Criar o item! ${error.response.data.message} 🚫`)
            embed.setColor('Red')
            embed.setTimestamp()

            console.log(error.response.data.message)
        } finally {

            embed.setFooter({ text: 'By Jubriscreuda', iconURL: 'https://i.ytimg.com/vi/s6V4BjURhOs/maxresdefault.jpg' })
            add(userId, 20)
            await interaction.editReply({ embeds: [embed], flags: [MessageFlags.Ephemeral] })
        }

    }
} 
