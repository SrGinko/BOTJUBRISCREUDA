const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require("discord.js")



module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Realms do Minecraft Bedrock'),

    async execute(interaction) {

        const select = new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Selecione')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Java')
                    .setDescription('Minecraft Java')
                    .setValue('java'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Bedrock')
                    .setDescription('Minecraft Bedrock')
                    .setValue('bedrock')

            )

        const row = new ActionRowBuilder()
            .addComponents(select)

        await interaction.reply({ content: `Selecione qual Minecraft`, components: [row] })
    }
}