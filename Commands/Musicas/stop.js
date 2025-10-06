const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')
const { useQueue, useMainPlayer } = require('discord-player')
const { addXp } = require('../../Utils/xp')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Para a música e a fila de reprodução'),

    async execute(interaction) {
        const musicChannel = interaction.guild.channels.cache.find(ch => ch.id === '1053145878594068571')
        const userId = interaction.member.id
        const queue = useQueue(interaction.guild.id)

        interaction.deferReply({ flags: [MessageFlags.Ephemeral] })

        addXp(userId, 10)
        queue.node.stop()
    }
}