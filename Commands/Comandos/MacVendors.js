const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const axios = require('axios')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('mac')
        .setDescription('Realiza uma busca da marca do equipamento pelo mac')
        .addStringOption(option => option.setName('mac').setDescription('Insira o MAC do aparelho (EX: 00-11-22-33-44-55)').setRequired(true)),

    async execute(interaction) {

        const { options } = interaction

        const mac = options.getString('mac')

        const response = await fetch(`https://api.macvendors.com/${mac}`)

        let data

        const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                data = await response.json(); 
            } else {
                data = await response.text();
            }

        if (typeof data !== 'object') {
            data = { mac: data }
            data = data.mac
        }else{
           data = data.errors.detail
        }

        const embed = new EmbedBuilder()
        .setTitle(`${data}`)
        .setColor('Random')

        
        await interaction.channel.sendTyping();
        await interaction.reply({embeds: [embed], ephemeral: true})

    }
}