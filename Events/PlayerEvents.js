const { useMainPlayer } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

const embed = new EmbedBuilder()
const embed2 = new EmbedBuilder()

const player = useMainPlayer();

player.events.on('playerStart', (queue, track) => {
    
    const musicChannel = queue.metadata.channel

    embed.setTitle('Musica')
    embed.setDescription(`Tocando: [${track.title}](${track.url})
        Duração: ${track.duration}`)
    embed.setThumbnail(track.thumbnail)
    embed.setColor('#ff7700')
    embed.setTimestamp()
    embed.setFooter({ text: 'Jubscreuda' })

    musicChannel.send({ embeds: [embed] })
})

player.events.on('playerError', (queue, error) => {
    console.log(error)
})

player.events.on('error', (queue, error) =>{
    console.log(error)
})

player.events.on('audioTrackAdd', (queue, track) => {
    const musicChannel = queue.metadata.channel

    embed.setTitle('Musica')
    embed.setDescription(`Adicionado a fila: [${track.title}](${track.url})
        Duração: ${track.duration}`)
    embed.setThumbnail(track.thumbnail)
    embed.setColor('#009e89')
    embed.setTimestamp()
    embed.setFooter({ text: 'Jubscreuda' })

    musicChannel.send({ embeds: [embed] })
})

player.events.on('emptyQueue', (queue) => {
    const musicChannel = queue.metadata.channel

    embed2.setTitle('Musica')
    embed2.setDescription('Sem musica para reprodução')
    embed2.setColor('#9723c4')
    embed2.setTimestamp()
    embed2.setFooter({ text: 'Jubscreuda' });

    musicChannel.send({ embeds: [embed2] });
})

player.events.on('playerSkip', (queue, track) => {
    const musicChannel = queue.metadata.channel

    embed.setTitle('Musica')
    embed.setDescription(`Pulando a Música: [${track.title}](${track.url})....`)
    embed.setThumbnail(track.thumbnail)
    embed.setColor('#ffff00')
    embed.setTimestamp()
    embed.setFooter({ text: 'Jubscreuda' })

    musicChannel.send({ embeds: [embed] })
})
