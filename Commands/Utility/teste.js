const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, Component } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('teste')
        .setDescription('teste'),

    async execute(interaction) {

        const LinkButton = new ButtonBuilder()
            .setLabel('teste')
            .setCustomId('teste')
            .setStyle(ButtonStyle.Success)

        const LinkButton1 = new ButtonBuilder()
            .setLabel('teste')
            .setCustomId('teste')
            .setStyle(ButtonStyle.Primary)
        const LinkButton2 = new ButtonBuilder()
            .setLabel('teste')
            .setCustomId('teste')
            .setStyle(ButtonStyle.Secundary)
        const LinkButton3 = new ButtonBuilder()
            .setLabel('teste')
            .setCustomId('teste')
            .setStyle(ButtonStyle.Danger)

        const row = new ActionRowBuilder()
            .addComponents(LinkButton, LinkButton1, LinkButton2, LinkButton3);

        await interaction.reply({ content: `TEST`, components: [row] })
    }
}