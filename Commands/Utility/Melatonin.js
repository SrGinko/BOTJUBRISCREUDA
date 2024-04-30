const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const Melatonin = new EmbedBuilder()
    .setTitle('Melatonin')
    .setColor('Blurple')
    .setURL('https://www.mediafire.com/file/y5wu2mlaq8gq1pl/Melatonin.v2023.10.30.rar/file')
    .setDescription('Link de Download do Jogo Melatonin')
    .setImage('https://cdn1.epicgames.com/spt-assets/07109b840b8446d089419a84742c9239/melatonin-bjrmy.png')
    .setThumbnail('https://cdn.discordapp.com/attachments/1119014051033403473/1215352011017424896/melatonin-1653417842916.jpg?ex=65fc6fc3&is=65e9fac3&hm=f64ccb0cb14397e71f5dc00c1f9a50435a17566e1a4d501bd7ae32434f78adf3&')
    .setFooter({ text: 'Mediafire.com', iconURL: 'https://cdn.discordapp.com/attachments/1119014051033403473/1213609191919591514/mediafire.png?ex=65f618a3&is=65e3a3a3&hm=51460e2f620b4787cfe81ae993e9c472437a43d817b71dae938b92a3392c0605&' })

module.exports = {
    data: new SlashCommandBuilder()
        .setName('melatonin')
        .setDescription('Link de Download do Jogo Melatonin'),


    async execute(interaction) {

        const LinkButton = new ButtonBuilder()
            .setLabel('Download')
            .setURL('https://www.mediafire.com/file/y5wu2mlaq8gq1pl/Melatonin.v2023.10.30.rar/file')
            .setStyle(ButtonStyle.Link)

        const Button = new ActionRowBuilder()
            .addComponents(LinkButton)

        await interaction.reply({embeds: [Melatonin], components: [Button], ephemeral: true })
    }
}