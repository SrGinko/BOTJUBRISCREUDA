const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { getVariaveis, eventEmitter } = require('../../Controle')

let stardew 

eventEmitter.on('atualizarStardew', (variaveis) => {
    if(variaveis.minecraft === ' ' ){
        stardew = stardew
    }else{
        stardew = variaveis.stardewvalley
    }
})

const Stardew = new EmbedBuilder()
    .setTitle('Stardew Valley')
    .setColor('Blue')
    .setURL(stardew)
    .setDescription('Link de Download do Stardew Valley (1.5.6)')
    .setImage('https://cdn.discordapp.com/attachments/1119014051033403473/1212776788506452019/capsule_616x353.jpg?ex=65f31166&is=65e09c66&hm=330d4411bfda91f0f5ba75573205b8e96ab54daa003c8a140ad7e4c73a1b246b&')
    .setThumbnail('https://cdn.discordapp.com/attachments/1119014051033403473/1212776746424737853/image.png?ex=65f3115c&is=65e09c5c&hm=19de8a49a88605bf03c7f787d0713bc9c1703410cd564c9d9a0033a8dc3754cf&')
    .setFooter({ text: 'Mediafire.com', iconURL: 'https://cdn.discordapp.com/attachments/1119014051033403473/1213609191919591514/mediafire.png?ex=65f618a3&is=65e3a3a3&hm=51460e2f620b4787cfe81ae993e9c472437a43d817b71dae938b92a3392c0605&' })

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stardewvalley')
        .setDescription('Link de Download do Stardew Valley (1.5.6)'),


    async execute(interaction) {

        const LinkButton = new ButtonBuilder()
            .setLabel('Download')
            .setURL(stardew)
            .setStyle(ButtonStyle.Link)

        const Button = new ActionRowBuilder()
            .addComponents(LinkButton)

        await interaction.reply({content: `${stardew}`,embeds: [Stardew], components: [Button], ephemeral: true })
    }
}
