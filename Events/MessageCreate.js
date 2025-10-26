const { Events } = require('discord.js')
const { addXp } = require('../Utils/xp')
const { addMenssage } = require('../Utils/addMensages')
const guildEvent = require('./GuildEvent')


module.exports = {
    name: Events.MessageCreate,
    on: true,
    async execute(message) {

        if (message.channel.type === 1) {
            if (message.author.bot) return

            const { GoogleGenAI } = require('@google/genai')

            const input = message.content
            message.channel.sendTyping()

            const ia = new GoogleGenAI({
                apiKey: process.env.GOOGLE_API_KEY
            })
            const response = await ia.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: input,
                config: {
                    systemInstruction: "Você é a Jubscreuda, um bot de discord engraçado e sarcástico. Uma assistente virtual que adora fazer piadas e trocadilhos. Responda de forma explicativa e breve. Caso pergutem Você veio do mundo de Minecraft e agora está como assistente aqui, antes você era uma jornalista casada com Josefano o prefeito da vila",
                }
            })

            await message.channel.send({ content: `${response.text}` })
            return
        }




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

            switch (mensagemTotal) {
                case 500:
                    guildEvent.emit('conquista', { conquista: faladorBronze, xp: 500, user: message.author, channel: message.channel })
                    addXp(message.author.id, 500)
                    message.member.roles.add(faladorBronze).catch(console.error)
                    break;
                case 1500:
                    guildEvent.emit('conquista', { conquista: faladorPrata, xp: 1500, user: message.author, channel: message.channel })
                    addXp(message.author.id, 1500)
                    message.member.roles.add(faladorPrata).catch(console.error)
                    if (message.member.roles.cache.has(faladorBronze)) {
                        message.member.roles.remove(faladorBronze)
                    }
                    message.member.roles.remove(faladorBronze).catch(console.error)
                case 3000:
                    guildEvent.emit('conquista', { conquista: faladorOuro, xp: 3000, user: message.author, channel: message.channel })
                    addXp(message.author.id, 3000)
                    message.member.roles.add(faladorOuro).catch(console.error)
                    if (message.member.roles.cache.has(faladorPrata)) {
                        message.member.roles.remove(faladorPrata)
                    }
                case 5000:
                    guildEvent.emit('conquista', { conquista: faladorPlatina, xp: 5000, user: message.author, channel: message.channel })
                    addXp(message.author.id, 5000)
                    message.member.roles.add(faladorPlatina).catch(console.error)
                    if (message.member.roles.cache.has(faladorOuro)) {
                        message.member.roles.remove(faladorOuro)
                    }
                case 10000:
                    guildEvent.emit('conquista', { conquista: faladorDiamante, xp: 10000, user: message.author, channel: message.channel })
                    addXp(message.author.id, 10000)
                    message.member.roles.add(faladorDiamante).catch(console.error)
                    if (message.member.roles.cache.has(faladorPlatina)) {
                        message.member.roles.remove(faladorPlatina)
                    }
                    break;
                default:
                    break;
            }

        }

    }
}