import { MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { api } from '../../service/axiosClient'
import { criarEmbed } from '../../Utils/embedFactory'
import { creatPerfil } from '../../Utils/utilsPerfil'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('perfil')
        .setDescription('Consultar seu Nível e quantidade de XP')
        .addUserOption(option => option
            .setName('user')
            .setDescription('Nome do usuário')),

    async execute(interaction: ChatInputCommandInteraction) {
        const userGlobal = interaction.options.getUser('user') ?? interaction.user
        await interaction.deferReply({ flags: MessageFlags.Ephemeral })

        if (userGlobal.bot) {
            await interaction.editReply({
                embeds: [criarEmbed({
                    description: 'Bots não tem perfil',
                    color: 'Red',
                })],
            })
            return
        }

        const response = await api.get(`/usuario/${userGlobal.id}`)
        const bannerIndex: number = response.data.wallpaper || 0
        const perfil = await creatPerfil(userGlobal.id, bannerIndex, interaction, 'usuario')
        if (!perfil) return
        const { conteiner, attachment } = perfil

        await interaction.editReply({
            components: [conteiner],
            files: [attachment],
            flags: MessageFlags.IsComponentsV2,
        })
    },
}
