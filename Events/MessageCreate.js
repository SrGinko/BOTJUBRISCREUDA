const { Events } = require('discord.js')
const { execute } = require('./ready')

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
    }
}