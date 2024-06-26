const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js")

const Server1 = new EmbedBuilder()
    .setTitle('ManicomioServer (Aternos Fechado)')
    .setColor('Green')
    .setDescription('Servidor Vanila de sobrevivencia Pelo Aternos')
    .setThumbnail('https://i0.wp.com/www.alphr.com/wp-content/uploads/2022/06/Aternos.png?resize=508%2C507&ssl=1')
    .addFields(
        { name: 'Endereço do Servidor', value: 'ManicomioServer0.aternos.me', inline: true },
        { name: 'Porta', value: '32462', inline: true }
    )
    .setImage('https://cdn.discordapp.com/attachments/1031036409231986778/1209664881146462278/efbda851-d764-455c-abd4-281712ed3a2e.png?ex=65f0f9b6&is=65de84b6&hm=0c1804ba1e1c1569ec895d30d8b725c433d7a343224a67fc10524d13bf800138&')


const realms = new EmbedBuilder()
    .setTitle('ManicomioRealms')
    .setColor('Green')
    .setDescription('Servidor Vanila de sobrevivência pelo Realms do Minecraft Bedrock')
    .setThumbnail('https://cdn.discordapp.com/attachments/1119014051033403473/1214758717103284305/Minecraft-Realms.png?ex=65fa4737&is=65e7d237&hm=bd93b4a920a7c1ea0225def1902f2b191b9df875f7eed1ebb5ebd79eb6dae676&')
    .setImage('https://cdn.discordapp.com/attachments/1031036409231986778/1209664881146462278/efbda851-d764-455c-abd4-281712ed3a2e.png?ex=65f0f9b6&is=65de84b6&hm=0c1804ba1e1c1569ec895d30d8b725c433d7a343224a67fc10524d13bf800138&')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('realms')
        .setDescription('Realms do Minecraft Bedrock'),

    async execute(interaction) {

        const buttRealms = new ButtonBuilder()
            .setLabel('Realms Link')
            .setStyle(ButtonStyle.Link)
            .setURL('https://realms.gg/D-jF9JUN5AY')

        const row1 = new ActionRowBuilder()
            .addComponents(buttRealms)

        await interaction.reply({ embeds: [realms], components: [row1] })

    }
}