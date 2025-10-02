const { SlashCommandBuilder, MessageFlags } = require('discord.js')
const { api } = require('../../Utils/axiosClient')
const battleManager = require('../../RPG/battleManager')
const { criarEmbed } = require('../../Utils/embedFactory')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('batalha')
        .setDescription('Inicie uma batalha contra um inimigo'),

    async execute(interaction) {
        const userId = interaction.user.id

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] })

        const player = await api.get(`/heroi/${userId}`)
        const channel = interaction.guild.channels.cache.get('1406878528859017248')


        if (!player) {
            await interaction.reply({ content: 'Você tem que ter um aventureiro para começar' })
        }
        await battleManager.começarBatalha({
            interaction: interaction,
            playerData: player.data,
            cliente: interaction.client,
            channel: channel
        })

        await interaction.editReply({
            embeds: [
               criarEmbed({
                    title: 'Batalha Iniciada! ⚔️',
                    description: `Você iniciou uma batalha contra um inimigo! Vá para o canal ${channel} para lutar!`,
                    color: 'Green',
                    footer: 'Jubscreuda RPG'
                })
            ], flags: 64
        })
    }
}