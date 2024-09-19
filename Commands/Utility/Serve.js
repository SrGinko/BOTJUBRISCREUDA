const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js")

const Server1 = new EmbedBuilder()
    .setTitle('Manicomio')
    .setColor('Green')
    .setDescription('Servidor com mod DownCraft')
    .setThumbnail('https://cdn.discordapp.com/attachments/1031036409231986778/1279949054125801512/image.png?ex=66d64cf2&is=66d4fb72&hm=de03c1aaf9c607d86aef8dcad41d7dcb1d8f27bf0fdc54ab5f5b6e88c44c9ee8&')
    .addFields(
        { name: 'Endereço do Servidor', value: 'selene.lura.pro:25570', inline: true },
        { name: 'Porta', value: '25570', inline: true }
    )
    .setImage('https://cdn.discordapp.com/attachments/1031036409231986778/1279949054125801512/image.png?ex=66d64cf2&is=66d4fb72&hm=de03c1aaf9c607d86aef8dcad41d7dcb1d8f27bf0fdc54ab5f5b6e88c44c9ee8&')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Realms do Minecraft Bedrock'),

    async execute(interaction) {

        await interaction.reply({ embeds: [Server1] })
    }
}