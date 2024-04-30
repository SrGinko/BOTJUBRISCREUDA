const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const poke = new EmbedBuilder()
    .setTitle('PokeMMO')
    .setColor('Red')
    .addFields(
        {name: 'Acesso aos Links', value: `https://discord.com/channels/1031036294433865850/1038287748433448991`, inline: true }
    )

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pokemmo')
        .setDescription('Acesso aos Links para poder Jogar PokeMMO'),

    async execute(interaction){
        await interaction.reply({embeds: [poke], ephemeral: true })
    }
}