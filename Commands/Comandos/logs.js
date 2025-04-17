const axios = require('axios')
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const dotenv = require('dotenv')
dotenv.config()
const { API_DISCLOUD } = process.env


const embed = new EmbedBuilder()

async function obterLogs(idApp) {
    const logs  = await axios.get(`https://api.discloud.app/v2/app/${idApp}/logs`, {
        headers: {
            "api-token ":  API_DISCLOUD
        }
    })

    return logs.data.apps.terminal.small
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('Ver logs de aplicações')
        .addStringOption(option => option.setName('id').setDescription('Insira o ID da Aplicação').setRequired(true).addChoices(
            {name: 'Jubscreuda', value: '1744590797338'},
            {name: 'API', value: 'apimonteiro'}
        )),


    async execute(interaction) {
        try {
            const userId = interaction.user.id
            const { options } = interaction
            const canalLogs = interaction.guild.channels.cache.find(c => c.name === 'logs')
    
            const idApp = options.getString('id')
    
                const member = interaction.member
                const adm = member.roles.cache.some(r => r.name === 'Adm')
    
                if (adm === true) {
                    
                    const logs = await obterLogs(idApp)
                    embed.setTitle(`Logs da aplicação ${idApp}`)
                    embed.setDescription(`\`\`\`${logs}\`\`\``)
                    embed.setColor('Green')
                    embed.setTimestamp()
                    canalLogs.send({ embeds: [embed] })
    
                } else if (adm === false) {
    
                    embed.setDescription(`Você não tem permição para executar este comando!`)
                    embed.setColor('Red')
                }
            
        } catch (error) {
            console.error(error)
        }

    }
}
