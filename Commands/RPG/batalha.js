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

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const player = await api.get(`/heroi/${userId}`)
        const channel = interaction.guild.channels.cache.get('1406878528859017248')

        const embed1 = await criarEmbed({ description: `A batalha irá começar no canal ${channel}`, color: '#0398fc' })
        const embed2 = await criarEmbed({ description: `A batalha já vai começar`, color: '#0398fc' })

        if (!player.data) {
            await interaction.editReply({ content: 'Você tem que ter um aventureiro para começar' })
        }

        const batalhaAtiva = battleManager.getBattleByUser(userId)

        if (batalhaAtiva) {
            return interaction.editReply({
                content: 'Você já está em uma batalha!',
                flags: [MessageFlags.Ephemeral]
            })
        }


        await battleManager.começarBatalha({
            interaction,
            playerData: player.data,
            channel
        })

        if (interaction.channel.id !== '1406878528859017248') {



            await interaction.editReply({ embeds: [embed1], flags: [MessageFlags.Ephemeral] })
        } else {
            await interaction.editReply({ embeds: [embed2], flags: [MessageFlags.Ephemeral] })
        }
    }
}