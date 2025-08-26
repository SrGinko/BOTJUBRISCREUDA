const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, MessageFlags } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const { addXp } = require('../../Utils/xp');

const embed = new EmbedBuilder()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Toca uma música do YouTube.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Connect | PermissionsBitField.Flags.Speak)
        .addStringOption(option =>
            option.setName('musica')
                .setDescription('Link do vídeo do YouTube')
                .setRequired(true)
        ),

    async execute(interaction) {

        const query = interaction.options.getString('musica');
        const userId = interaction.member.id
        const voiceChannel = interaction.member.voice.channel;
        const musicChannel = interaction.guild.channels.cache.find(channel => channel.id === '1053145878594068571');

        interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const queue = useQueue(interaction.guild.id)
        const player = useMainPlayer()

        if (!voiceChannel) {
            embed.setTitle('Musica')
            embed.setDescription('Você precisa estar em um canal de voz para tocar música.')
            embed.setColor('#FF0000')
            embed.setTimestamp()
            embed.setFooter({ text: 'Jubscreuda' })
            return musicChannel.send({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }

        const { track } = await player.play(voiceChannel, query, {
            nodeOptions: {
                metadata: { channel: musicChannel },
            },
        })

        addXp(userId, 10)

    }
}
