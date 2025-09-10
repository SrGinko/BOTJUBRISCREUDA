const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js')
const { api } = require('../../Utils/axiosClient')
const { addXp } = require('../../Utils/xp')

const embed = new EmbedBuilder()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('criarheroi')
        .setDescription('Crie seu herói')
        .addStringOption(option => option.setName('nome').setDescription('Nome do seu herói').setAutocomplete(true).setRequired(true)),

    async execute(interaction) {
        const { options } = interaction
        const userId = interaction.user.id
        const member = interaction.member

        const RPG = interaction.guild.roles.cache.find(r => r.name === 'RPG')

        const heroiName = options.getString('nome')

        await api.post(`/heroes`, {
            nome: heroiName,
            userID: userId

        }).then(() => {
            embed.setTitle("Heroi Criado com Sucesso! ✅")
            embed.setColor('Green')
            embed.setTimestamp()
            
            member.roles.add(RPG)

        }).catch((error) => {
            embed.setTitle(`Erro ao criar herói! ${error.response.data.message} 🚫`)
            embed.setColor('Red')
            embed.setTimestamp()

            console.log(error.response.data.message)
        })

        embed.setFooter({ text: 'By Jubriscreuda', iconURL: 'https://i.ytimg.com/vi/s6V4BjURhOs/maxresdefault.jpg' })
        addXp(userId, 100)
        await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] })
    }
} 
