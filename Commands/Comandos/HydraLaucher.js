const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const hydra = new EmbedBuilder()
    .setTitle('HydraLaucher <:hydra:1255365685232537651>')
    .setColor('#030303')
    .addFields(
        {name: '``Acesso aos Links``', value: `https://discord.com/channels/1031036294433865850/1297632360665186335`, inline: true }
    )

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hydra')
        .setDescription('Acesso ao Link de Download da HydraLaucher'),

    async execute(interaction){
        
        await interaction.channel.sendTyping();
        await interaction.reply({embeds: [hydra], ephemeral: true })
    }
}