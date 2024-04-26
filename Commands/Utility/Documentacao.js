const { SlashCommandBuilder, EmbedBuilder, hyperlink, } = require("discord.js")
const url1 = 'https://discordjs.guide/#before-you-begin'
const discordjs = hyperlink('Clique aqui', url1)
const JavaScriptWeb = hyperlink('Clique aqui', 'https://www.w3schools.com/js/default.asp')

const Documentacao = new EmbedBuilder()
    .setTitle('Documentações')
    .setColor('Random')
    .setFields(
        { name: 'Discord.js: ', value: discordjs, inline: true },
        {name: '\u200B', value:'\u200B', inline:true},
        { name: 'JavaScriptWeb: ', value: JavaScriptWeb, inline:true},
        { name: 'Unity: ', value: discordjs, inline:true},
        {name: '\u200B', value:'\u200B', inline:true},
        { name: 'CSS: ', value: discordjs, inline:true},
        { name: 'HTML: ', value: discordjs, inline:true}
    )

module.exports = {
    data: new SlashCommandBuilder()
        .setName('documentacao')
        .setDescription('Documentações de algumas linguagens de programação'),

    async execute(interaction) {

        await interaction.reply({ embeds: [Documentacao], })
    }
}