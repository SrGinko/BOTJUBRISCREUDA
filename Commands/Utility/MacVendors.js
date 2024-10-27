const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const axios = require('axios')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('mac')
        .setDescription('Realiza uma busca da marca do equipamento pelo mac')
        .addStringOption(option => option.setName('mac').setDescription('Insira o MAC do aparelho (EX: 00-11-22-33-44-55)').setRequired(true)),
        
        async execute(interaction) {
        
        const {options} = interaction
            
        const mac = options.getString('mac')
        

        const response = await axios.get(`https://api.macvendors.com/${mac}`)
        const dados = response.data
        const json = JSON.stringify(dados)
        const novoMac = json.replaceAll('"', '`')

        const embeds = new EmbedBuilder()
            .setDescription(`A marca do seu aparelho é: ${novoMac}`)
            .setColor('Random')

        await interaction.reply({ embeds: [embeds] })
    }
}