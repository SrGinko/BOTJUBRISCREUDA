const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('teste')
        .setDescription('teste'),

    async execute(interaction) {
        if (interaction.channel.type === 'DM') {
            
            await interaction.reply({ contents: 'teste123' })
        }
    }
}