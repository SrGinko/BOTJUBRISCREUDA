import { ChannelType, Events, type Message } from 'discord.js'
import { addXp } from '../Utils/xp'
import { addMenssage } from '../Utils/addMensagens'

module.exports = {
    name: Events.MessageCreate,
    on: true,
    async execute(message: Message) {
        if (message.channel.type === ChannelType.DM) {
            if (message.author.bot) return

            const { GoogleGenAI } = require('@google/genai')
            const ia = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })
            const response = await ia.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: message.content,
                config: {
                    systemInstruction: 'Você é a Jubscreuda, um bot de discord engraçado e sarcástico. Uma assistente virtual que adora fazer piadas e trocadilhos. Responda de forma explicativa e breve. Caso pergutem Você veio do mundo de Minecraft e agora está como assistente aqui, antes você era uma jornalista casada com Josefano o prefeito da vila',
                },
            })

            await message.channel.send({ content: `${response.text}` })
            return
        }

        const guild = message.guild
        if (!guild) return

        const bot = guild.members.cache.get(message.author.id)
        const cargo = '1286201893516742696'
        if (message.channel.id !== '1053145878594068571' && bot?.roles.cache.has(cargo)) {
            await message.delete()
        }

        if (!message.author.bot) {
            await addMenssage(message.author, 1, message)
            void addXp(message.author.id, 10)
        }
    },
}
