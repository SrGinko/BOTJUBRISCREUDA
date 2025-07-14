const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')
const { useQueue, useMainPlayer } = require('discord-player')

const embed = new EmbedBuilder()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('letra')
        .setDescription('Letra da Música tocando atualmente'),

    async execute(interaction) {
        const musicChannel = interaction.guild.channels.cache.find(ch => ch.id === '1053145878594068571')
        const userId = interaction.member.id
        const queue = useQueue(interaction.guild.id)

        interaction.deferReply({ flags: [MessageFlags.Ephemeral] })

        const musicLyrics = queue.currentTrack.title

        console.log(musicLyrics)

        const player = useMainPlayer()

        const lyrics = await player.lyrics.search({
            q: musicLyrics
        })

        if (!lyrics.length) {
            embed.setDescription('Não foi possível encontrar a letra da música')
            embed.setColor('Red')
            embed.setTimestamp()
            embed.setFooter({ text: 'Jubscreuda' })
            return musicChannel.send({ embeds: [embed] })
        }

        console.log(lyrics[0].plainLyrics)
        
        queue.node.skip(`${lyrics[0].plainLyrics}`)

        return musicChannel.send({ contents: `${lyrics[0].plainLyrics}` })
    }
}