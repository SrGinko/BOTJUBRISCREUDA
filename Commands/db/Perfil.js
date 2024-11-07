const { SlashCommandBuilder, EmbedBuilder} = require("discord.js")
const db = require('../../db')
const { Hoje } = require("../../Controller")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('perfil')
        .setDescription('Consultar seu Nível e quantidade de XP'),

    async execute(interaction) {
        const userId = interaction.user.id
        const avatar = interaction.user.displayAvatarURL({ dynamic: true, size: 1024 })

        const sumt = db.prepare(`SELECT * from users WHERE id = ?`)
        const user = sumt.get(userId)

        const username = user.username

        const agora = Hoje()

        const embed = new EmbedBuilder()
            .setTitle(username)
            .setColor('#00a86d')
            .setFields(
                { name: 'Nivel:', value: `${user.lvl}` },
                { name: 'XP:', value: `${user.xp}` }
            )
            .setThumbnail(avatar)
            .setFooter({ text: `By Jubscreuda ∘ ${agora.horas}:${agora.minutos} - ${agora.dia}/${agora.mes}` , iconURL: 'https://i.ytimg.com/vi/s6V4BjURhOs/maxresdefault.jpg' })

        await interaction.channel.sendTyping();
        await interaction.reply({ embeds: [embed]})
    }

}
