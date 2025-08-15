const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fila')
        .setDescription('Mostra a fila de músicas'),

    async execute(interaction) {
        try {
            const musicChannel = interaction.guild.channels.cache.find(channel => channel.id === '1053145878594068571');
            const queue = useQueue(interaction.guild.id);

            if (!queue) {
                return interaction.reply(
                    'This server does not have an active player session.',
                );
            }

            const currentTrack = queue.current;

            // const upcomingTracks = queue.data.slice(0, 5);
            console.log(queue.tracks[0]);

            const message = [
                `**Now Playing:** ${currentTrack.title} - ${currentTrack.author}`,
                '',
                '**Upcoming Tracks:**',
                ...upcomingTracks.map(
                    (track, index) => `${index + 1}. ${track.title} - ${track.author}`,
                ),
            ].join('\n');

            return musicChannel.send(message);
        } catch (error) {
            console.log(error);
        }
    }
}