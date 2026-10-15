import { EmbedBuilder, MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { api } from '../../../service/axiosClient'
import { createPvpChallenge, getBattleByUser, getChallengeByUser, comecarBatalha } from '../../../RPG/battleManager'
import type { HeroData } from '../../../types/RPG'

const battleChannelId = '1406878528859017248'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('batalha')
        .setDescription('Inicie uma batalha contra inimigos ou contra outro jogador')
        .addUserOption(option => option
            .setName('usuario')
            .setDescription('Jogador para desafiar em uma batalha PvP')
            .setRequired(false)),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral })

        if (!interaction.guild) {
            return interaction.editReply({ content: 'Este comando só pode ser usado em um servidor.' })
        }
        const battleChannel = interaction.guild.channels.cache.get(battleChannelId)
        if (!battleChannel?.isTextBased() || !battleChannel.isSendable()) {
            return interaction.editReply({ content: 'O canal de batalhas não está disponível.' })
        }

        const { data: playerData } = await api.get<HeroData | null>(`/heroi/${interaction.user.id}`)
        if (!playerData) return interaction.editReply({ content: 'Você precisa criar um herói para começar.' })
        if (getBattleByUser(interaction.user.id)) {
            return interaction.editReply({ content: 'Você já está em uma batalha!' })
        }

        const targetUser = interaction.options.getUser('usuario')
        if (targetUser) {
            if (targetUser.bot) return interaction.editReply({ content: 'Não é possível iniciar uma batalha PvP contra bots.' })
            if (targetUser.id === interaction.user.id) return interaction.editReply({ content: 'Você não pode batalhar contra si mesmo.' })
            if (getBattleByUser(targetUser.id)) return interaction.editReply({ content: 'Esse jogador já está em uma batalha.' })
            if (getChallengeByUser(interaction.user.id) || getChallengeByUser(targetUser.id)) {
                return interaction.editReply({ content: 'Já existe um desafio pendente envolvendo um desses jogadores.' })
            }

            const { data: targetHero } = await api.get<HeroData | null>(`/heroi/${targetUser.id}`)
            if (!targetHero) return interaction.editReply({ content: 'O jogador selecionado não possui um herói para batalhar.' })
            const challenge = await createPvpChallenge({
                channel: battleChannel,
                challengerUser: interaction.user,
                targetUser,
            })
            if (!challenge) return interaction.editReply({ content: 'Não foi possível criar o desafio. Tente novamente.' })

            const description = interaction.channelId !== battleChannelId
                ? `O desafio foi enviado para ${targetUser} no canal ${battleChannel}.`
                : `O desafio foi enviado para ${targetUser}. Aguarde a resposta.`
            return interaction.editReply({ embeds: [new EmbedBuilder().setColor('#0398fc').setDescription(description)] })
        }

        const battle = await comecarBatalha({
            interaction,
            playerData,
            channel: battleChannel,
        })
        if (!battle) return interaction.editReply({ content: 'Não foi possível iniciar a batalha.' })

        const description = interaction.channelId !== battleChannelId
            ? `A batalha vai começar no canal ${battleChannel}.`
            : 'A batalha já vai começar.'
        return interaction.editReply({ embeds: [new EmbedBuilder().setColor('#0398fc').setDescription(description)] })
    },
}
