const { SlashCommandBuilder, AttachmentBuilder, MediaGalleryBuilder, ContainerBuilder, MessageFlags, ThumbnailBuilder, SectionBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } = require("discord.js")
const { criarEmbed } = require("../../Utils/embedFactory");
const { api } = require("../../Utils/axiosClient");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('perfil')
        .setDescription('Consultar seu Nível e quantidade de XP')
        .addUserOption(options => options.setName('user').setDescription('Nome do usuário')),


    async execute(interaction) {

        const { options } = interaction

        const userGlobal = options.getUser('user') || interaction.user
        let userId = userGlobal.id

        await interaction.deferReply({flags:[MessageFlags.Ephemeral]});

        if (userGlobal.bot) {
            await interaction.editReply({
                embeds: [criarEmbed({
                    description: 'Bots não tem perfil',
                    color: 'Red'
                })], flags: 64
            })

            return
        }

        const response = await api.get(`/usuario/${userId}`)
        const user = response.data
        const bannerIndex = user.wallpaper || 0
        
        const { conteiner, attachment } = await require('../../Utils/utilsPerfil').creatPerfil(userGlobal, bannerIndex, interaction)

        await interaction.editReply({
            components: [conteiner],
            files: [attachment],
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
        })
    }
}