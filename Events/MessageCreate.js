const { Events } = require('discord.js')
const { addXp } = require('../Utils/xp')
const { addMenssage } = require('../Utils/addMensagens')
const guildEvent = require('./GuildEvent')
const WebSocket = require('ws')

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

            await addMenssage(message.author, 1, message)
            addXp(message.author.id, 10)

        }

    }
}