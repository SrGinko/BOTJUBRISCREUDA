const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const db = require('../../db')
const { ranking } = require("../../Controller")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ranking')
        .setDescription('Consultar Ranking de usuários'),

    async execute(interaction) {

        const sumt = db.prepare(`SELECT * from users`)
        var user = sumt.all()

        user = await ranking(user)

        console.log(user)
        

        var primeiro = user[0]
        var segundo = user[1]
        var terceiro = user[2]
        var quarto = user[3]

        const embed = new EmbedBuilder()
            .setTitle('Ranking')
            .setColor('#004078')
            .setFields(
                { name: 'Nome ', value: '\u200B', inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: 'Nivel ', value: '\u200B', inline: true },
                { name: ` 1️⃣ | ${primeiro.username}`, value: `⋇| XP: ${primeiro.xp}`, inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: `${primeiro.lvl}`, value: '\u200B', inline: true },
                { name: ` 2️⃣ | ${segundo.username}`, value: `⋇ | XP: ${segundo.xp}`, inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: `${segundo.lvl}`, value: '\u200B', inline: true },
                { name: ` 3️⃣ | ${terceiro.username}`, value: `⋇ | XP: ${terceiro.xp}`, inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: `${terceiro.lvl}`, value: '\u200B', inline: true },
                { name: ` 4️⃣ | ${quarto.username}`, value: `⋇ | XP: ${quarto.xp}`, inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: `${quarto.lvl}`, value: '\u200B', inline: true },
            )
            .setFooter({ text: 'By Jubscreuda', iconURL: 'https://i.ytimg.com/vi/s6V4BjURhOs/maxresdefault.jpg' })


        await interaction.reply({ embeds: [embed] })
    }
}
