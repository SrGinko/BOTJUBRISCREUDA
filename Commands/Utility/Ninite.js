const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Component, } = require("discord.js")
const { execute } = require("./StardewValley")


const Ninite = new EmbedBuilder()
    .setTitle('Ninite')
    .setColor('Random')
    .setDescription('APPS padrões')
    .setURL('https://www.mediafire.com/file/k9zbz55wsm7jgzm/Ninite_Chrome_Discord_Google_Drive_for_Desktop_Installer.exe/file')
    .setImage("https://cdn.discordapp.com/attachments/1119014051033403473/1212601554662592514/download.jpg?ex=65f26e33&is=65dff933&hm=2501398f48d8ebaa04c1df87b6268b6d04dec26b7687428a5b43fad7013d65e1&")
    .setThumbnail("https://cdn.discordapp.com/attachments/1119014051033403473/1212602916855087144/image.png?ex=65f26f78&is=65dffa78&hm=06fb5edb46e9d132dc9a3476c8a014fadff24e7adb7b07f3e578659d543ac256&")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ninite')
        .setDescription('APPS Padrões'),


    async execute(interaction) {
        
        const Botton = new ButtonBuilder()
            .setLabel('Download')
            .setURL('https://www.mediafire.com/file/k9zbz55wsm7jgzm/Ninite_Chrome_Discord_Google_Drive_for_Desktop_Installer.exe/file')
            .setStyle(ButtonStyle.Link)

        const row = new ActionRowBuilder()
             .addComponents(Botton)

        await interaction.reply({embeds: [Ninite], components:[row]})
    }

}