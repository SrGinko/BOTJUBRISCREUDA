const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Colors } = require('discord.js');

const hydra = new EmbedBuilder()
    .setTitle('HydraLaucher <:hydra:1255365685232537651>')
    .setColor('DarkGreen')
    .addFields(
        {name: 'Acesso aos Links', value: `https://discord.com/channels/1031036294433865850/1249048557089067108`, inline: true }
    )

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hydra')
        .setDescription('Acesso ao Link de Download da HydraLaucher'),

    async execute(interaction){
        await interaction.reply({embeds: [hydra], ephemeral: true })
    }
}