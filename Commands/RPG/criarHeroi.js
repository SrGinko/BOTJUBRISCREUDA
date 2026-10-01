const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js')
const { api } = require('../../Utils/axiosClient')
const { addXp } = require('../../Utils/xp')
const { handleError } = require('../../handlers/errorsHandler')

const embed = new EmbedBuilder()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('criarheroi')
        .setDescription('Crie seu herói')
        .addStringOption(option => option.setName('nome').setDescription('Nome do seu herói').setRequired(true)),

    async execute(interaction) {
        const { options } = interaction
        const userId = interaction.user.id
        const member = interaction.member

        interaction.deferReply()

        const RPG = interaction.guild.roles.cache.find(r => r.name === 'RPG')

        const heroiName = options.getString('nome')

        await api.post(`/heroi`, {
            nome: heroiName,
            userID: userId

        }).then(() => {
            embed.setTitle("Heroi Criado com Sucesso! ✅")
            embed.setColor('Green')
            embed.setTimestamp()

            member.roles.add(RPG)

        }).catch((error) => {

            handleError(interaction, 'Ocorreu um erro ao criar o herói. Por favor, tente novamente mais tarde.', '❌ Erro ao Criar Herói')

            console.log(error.response.data.message)
        })

        embed.setFooter({ text: 'By Jubriscreuda', iconURL: 'https://i.ytimg.com/vi/s6V4BjURhOs/maxresdefault.jpg' })
        addXp(userId, 100)
        await interaction.editReply({ embeds: [embed], flags: [MessageFlags.Ephemeral] })
    }
} 
