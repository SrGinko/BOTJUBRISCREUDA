const { SlashCommandBuilder, MessageFlags } = require('discord.js')
const { api } = require('../../Utils/axiosClient')
const battleManager = require('../../RPG/battleManager')
const { criarEmbed } = require('../../Utils/embedFactory')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('batalha')
        .setDescription('Inicie uma batalha contra inimigos ou contra outro jogador')
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('Jogador para desafiar em uma batalha PvP')
                .setRequired(false)
        ),

    async execute(interaction) {
        const userId = interaction.user.id
        const targetUser = interaction.options.getUser('usuario')

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] })

        const playerResponse = await api.get(`/heroi/${userId}`)
        const playerData = playerResponse.data
        const channel = interaction.guild.channels.cache.get('1406878528859017248')

        if (!playerData) {
            await interaction.editReply({ content: 'Voce tem que ter um aventureiro para comecar.' })
            return
        }

        const batalhaAtiva = battleManager.getBattleByUser(userId)
        if (batalhaAtiva) {
            await interaction.editReply({
                content: 'Voce ja esta em uma batalha!',
                flags: [MessageFlags.Ephemeral]
            })
            return
        }

        if (targetUser) {
            if (targetUser.bot) {
                await interaction.editReply({
                    content: 'Nao e possivel iniciar batalha PvP contra bots.',
                    flags: [MessageFlags.Ephemeral]
                })
                return
            }

            if (targetUser.id === userId) {
                await interaction.editReply({
                    content: 'Voce nao pode batalhar contra voce mesmo.',
                    flags: [MessageFlags.Ephemeral]
                })
                return
            }

            const batalhaAlvoAtiva = battleManager.getBattleByUser(targetUser.id)
            if (batalhaAlvoAtiva) {
                await interaction.editReply({
                    content: 'Esse jogador ja esta em uma batalha.',
                    flags: [MessageFlags.Ephemeral]
                })
                return
            }

            const desafioAtivo = battleManager.getChallengeByUser(userId) || battleManager.getChallengeByUser(targetUser.id)
            if (desafioAtivo) {
                await interaction.editReply({
                    content: 'Ja existe um desafio pendente envolvendo um desses jogadores.',
                    flags: [MessageFlags.Ephemeral]
                })
                return
            }

            const targetResponse = await api.get(`/heroi/${targetUser.id}`)
            const targetPlayerData = targetResponse.data

            if (!targetPlayerData) {
                await interaction.editReply({
                    content: 'O jogador selecionado nao possui um heroi para batalhar.',
                    flags: [MessageFlags.Ephemeral]
                })
                return
            }

            await battleManager.createPvpChallenge({
                interaction,
                channel,
                challengerUser: interaction.user,
                targetUser
            })

            const embedDesafio = await criarEmbed({
                description: interaction.channel.id !== '1406878528859017248'
                    ? `O desafio foi enviado para ${targetUser} no canal ${channel}.`
                    : `O desafio foi enviado para ${targetUser}. Agora e so esperar a resposta.`,
                color: '#0398fc'
            })

            await interaction.editReply({
                embeds: [embedDesafio],
                flags: [MessageFlags.Ephemeral]
            })
            return
        }

        await battleManager.comecarBatalha({
            interaction,
            playerData,
            channel
        })

        const embedCanalSeparado = await criarEmbed({
            description: `A batalha ira comecar no canal ${channel}`,
            color: '#0398fc'
        })
        const embedCanalAtual = await criarEmbed({
            description: 'A batalha ja vai comecar',
            color: '#0398fc'
        })

        await interaction.editReply({
            embeds: [interaction.channel.id !== '1406878528859017248' ? embedCanalSeparado : embedCanalAtual],
            flags: [MessageFlags.Ephemeral]
        })
    }
}
