const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const db = require('../../db')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ranking')
        .setDescription('Consultar Ranking de usuários'),

    async execute(interaction) {

        const sumt = db.prepare(`SELECT * from users`)
        const user = sumt.get()
        console.log(user)
        // const username = user.username

        // const embed = new EmbedBuilder()
        //     .setTitle('Ranking')
        //     .setFields(
        //         { name: 'Nivel', value: `${user.lvl}`},
        //         { name: 'XP:', value: `${user.xp}` }
        //     )
        //     .setThumbnail(avatar)
        //     .setFooter({ text: 'By Jubscreuda', iconURL: 'https://i.ytimg.com/vi/s6V4BjURhOs/maxresdefault.jpg' })


        // await interaction.reply({ embeds: [embed] })
    }

}
