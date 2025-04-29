const { Events, EmbedBuilder } = require('discord.js')
const { addXp, addLVL } = require('../Controller')
const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()
const { URL_USUARIO } = process.env

module.exports = {
    name: Events.MessageCreate,
    on: true,
    async execute(message) {

            const bot = message.guild.members.cache.get(message.author.id)
            const cargo = '1286201893516742696'
            if (message.channel.id !== '1053145878594068571') {
                if (bot) {
                    if (bot && bot.roles.cache.has(cargo)) {
                        message.delete()
                    }
                }
            }

            if(!message.author.bot){
                await axios.patch(`${URL_USUARIO}/${message.author.id}`, {
                    foto: message.author.displayAvatarURL({extensions: 'jpeg'})
                })

                addXp(message.author.id, 10)
                addLVL(message.author.id)
            }

            if (message.channel.id === '1038287340889706498') {
                const jogoGratis = message.guild.roles.cache.find(r => r.name === 'JogosGratis')
                const chat = message.client.channels.cache.get('1031036295482454069')

                const gratis = new EmbedBuilder()
                    .setColor('Random')
                    .setDescription(`Venha pegar seus jogos grátis da semana! ${jogoGratis}`)
                    .addFields(
                        { name: 'Acesse por aqui:', value: 'https://discord.com/channels/1031036294433865850/1038287340889706498' }
                    )

                await chat.send({ embeds: [gratis] })
            }
        
    }
}