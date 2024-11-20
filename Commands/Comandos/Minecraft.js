const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js")
const { addXp, addLVL } = require('../../Controller')

let mine = 'https://m0ve-my.sharepoint.com/:f:/g/personal/pmonteiro_m0ve_onmicrosoft_com/EiEzw7PDsk5NiRUHRk_4Xp4BBpZkmlfLhKdJxO9HJsRPQQ?e=bsZRYK'

const Minecraft = new EmbedBuilder()
    .setTitle('Minecraft Bedrock(Android)')
    .setColor('#28fa08')
    .setDescription('`Minecraft apk para download`')
    .setURL(mine)
    .setImage("https://media.discordapp.net/attachments/1119014051033403473/1212601554662592514/download.jpg?ex=65f26e33&is=65dff933&hm=2501398f48d8ebaa04c1df87b6268b6d04dec26b7687428a5b43fad7013d65e1&=&format=webp")
    .setThumbnail("https://cdn.discordapp.com/attachments/1119014051033403473/1212602916855087144/image.png?ex=65f26f78&is=65dffa78&hm=06fb5edb46e9d132dc9a3476c8a014fadff24e7adb7b07f3e578659d543ac256&")
    .setFooter({ text: 'Mediafire.com', iconURL: 'https://cdn.discordapp.com/attachments/1119014051033403473/1213609191919591514/mediafire.png?ex=65f618a3&is=65e3a3a3&hm=51460e2f620b4787cfe81ae993e9c472437a43d817b71dae938b92a3392c0605&' })


module.exports = {
    data: new SlashCommandBuilder()
        .setName('minecraft')
        .setDescription('Link de download do Minecraft Bedrock(Android)'),

    async execute(interaction) {

        const userId = interaction.user.id

        const LinkButton = new ButtonBuilder()
            .setLabel('Download')
            .setURL(mine)
            .setStyle(ButtonStyle.Link)

        const row = new ActionRowBuilder()
            .addComponents(LinkButton);


        addXp(userId, 10)
        addLVL(userId)
        await interaction.reply({ embeds: [Minecraft], components: [row], ephemeral: true })
    }
}
