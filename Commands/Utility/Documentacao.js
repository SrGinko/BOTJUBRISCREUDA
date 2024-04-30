const { SlashCommandBuilder, EmbedBuilder, hyperlink, } = require("discord.js")

const Documentacao = new EmbedBuilder()
    .setTitle('Documentações')
    .setColor('Random')
    .setFields(
        { name: 'Discord.js: ', value: hyperlink('Clique aqui', 'https://www.w3schools.com/js/default.asp'), inline: true },
        {name: '\u200B', value:'\u200B', inline:true},
        { name: 'JavaScriptWeb: ', value: hyperlink('Clique aqui', 'https://www.w3schools.com/js/default.asp'), inline:true},
        { name: 'Unity: ', value: hyperlink('Clique aqui', 'https://docs.unity.com/'), inline:true},
        {name: '\u200B', value:'\u200B', inline:true},
        { name: 'CSS: ', value: hyperlink('Clique aqui', 'https://www.w3schools.com/css/default.asp'), inline:true},
        { name: 'HTML: ', value: hyperlink('Clique aqui', 'https://www.w3schools.com/html/default.asp'), inline:true},
        {name: '\u200B', value:'\u200B', inline:true},
        { name: 'Bootstrap: ', value: hyperlink('Clique aqui', 'https://www.w3schools.com/html/default.asp'), inline:true},
    )

module.exports = {
    data: new SlashCommandBuilder()
        .setName('documentacao')
        .setDescription('Documentações de algumas linguagens de programação'),

    async execute(interaction) {

        await interaction.reply({ embeds: [Documentacao],})
    }
}