const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')
const { useQueue } = require('discord-player')
const { addXp } = require('../../Controller')

const embed = new EmbedBuilder()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Pula musica que está tocando atualmente'),

    async execute(interaction) {
        const musicChannel = interaction.guild.channels.cache.find(ch => ch.id === '1053145878594068571')
        const userId = interaction.member.id
        const queue = useQueue(interaction.guild.id)

        interaction.deferReply({ flags: [MessageFlags.Ephemeral] })

        if (!queue) {

            embed.setDescription('Não ha música tocando para pular')
            embed.setColor('Red')
            embed.setTimestamp()
            embed.setFooter({ text: 'Jubscreuda' })

            return musicChannel.send({ embeds: [embed] })
        }

        if (!queue.isPlaying()) {

            embed.setDescription('Não há próxima musica para pular')
            embed.setColor('Red')
            embed.setTimestamp()
            embed.setFooter({ text: 'Jubscreuda' })

            return musicChannel.send({ embeds: [embed] })
        }

        addXp(userId, 5)
        queue.node.skip()

    }
}