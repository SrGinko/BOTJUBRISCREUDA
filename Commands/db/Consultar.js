const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")
const db = require('../../db')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('consultar')
        .setDescription('Consultar seu Nível e quantidade de XP'),

    async execute(interaction) {
        const userId = interaction.user.id
        const avatar = interaction.user.displayAvatarURL({ dynamic: true, size: 1024 })

        const sumt = db.prepare(`SELECT * from users WHERE id = ?`)
        const user = sumt.get(userId)

        const username = user.username

        const embed = new EmbedBuilder()
            .setTitle(username)
            .setColor('#00a86d')
            .setFields(
                { name: 'Nivel:', value: `${user.lvl}` },
                { name: 'XP:', value: `${user.xp}` }
            )
            .setThumbnail(avatar)
            .setFooter({ text: 'By Jubscreuda', iconURL: 'https://i.ytimg.com/vi/s6V4BjURhOs/maxresdefault.jpg' })

        await interaction.channel.sendTyping();
        await interaction.reply({ embeds: [embed]})
    }

}
