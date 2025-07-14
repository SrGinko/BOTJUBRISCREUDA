const { Events, EmbedBuilder } = require('discord.js')
const { addXp, addLVL, addMenssage } = require('../Controller')
const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()
const { URL_USUARIO } = process.env

module.exports = {
    name: Events.MessageCreate,
    on: true,
    async execute(message) {

        const faladorBronze = message.guild.roles.cache.find(r => r.name === 'Falador Bronze')
        const faladorPrata = message.guild.roles.cache.find(r => r.name === 'Falador Prata')
        const faladorOuro = message.guild.roles.cache.find(r => r.name === 'Falador Ouro')
        const faladorPlatina = message.guild.roles.cache.find(r => r.name === 'Falador Platina')
        const faladorDiamante = message.guild.roles.cache.find(r => r.name === 'Falador Diamante')


        const bot = message.guild.members.cache.get(message.author.id)
        const cargo = '1286201893516742696'
        if (message.channel.id !== '1053145878594068571') {
            if (bot) {
                if (bot && bot.roles.cache.has(cargo)) {
                    message.delete()
                }
            }
        }

        if (!message.author.bot) {

            const mensagemTotal = await addMenssage(message.author.id, 1)
            addXp(message.author.id, 10)
            addLVL(message.author.id)

            switch (mensagemTotal) {
                case 500:
                    message.channel.send({ content: `Parabéns! ${message.author} Você já enviou 500 mensagens!` })
                    addXp(message.author.id, 500)
                    message.member.roles.add(faladorBronze).catch(console.error)
                    break;
                case 1500:
                    message.channel.send({ content: `Parabéns! ${message.author} Você já enviou 1500 mensagens!` })
                    addXp(message.author.id, 1500)
                    message.member.roles.add(faladorPrata).catch(console.error)
                case 3000:
                    message.channel.send({ content: `Parabéns! ${message.author} Você já enviou 3000 mensagens!` })
                    addXp(message.author.id, 3000)
                    message.member.roles.add(faladorOuro).catch(console.error)
                case 5000:
                    message.channel.send({ content: `Parabéns! ${message.author} Você já enviou 5000 mensagens!` })
                    addXp(message.author.id, 5000)
                    message.member.roles.add(faladorPlatina).catch(console.error)
                case 10000:
                    message.channel.send({ content: `Parabéns! ${message.author} Você já enviou 10000 mensagens!` })
                    addXp(message.author.id, 10000)
                    message.member.roles.add(faladorDiamante).catch(console.error)
                    break;

                default:
                    break;
            }

        }
    }
}