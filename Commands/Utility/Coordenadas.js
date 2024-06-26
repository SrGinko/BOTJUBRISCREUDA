const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

const Coordenadas = new EmbedBuilder()
    .setTitle('Coodernadas')
    .setColor('Random')
    .setDescription('Selecione as coordenadas que deseja do Manicomio')
    .setImage('https://cdn.discordapp.com/attachments/1031036409231986778/1215328315326595132/image.png?ex=65fc59b2&is=65e9e4b2&hm=fd3fa6b015c34e1de183b62146c6c1a793ca0068b5543821b0d13a4ca8b5f8bf&')
    .setThumbnail('https://cdn.discordapp.com/attachments/1119014051033403473/1214758717103284305/Minecraft-Realms.png?ex=65fa4737&is=65e7d237&hm=bd93b4a920a7c1ea0225def1902f2b191b9df875f7eed1ebb5ebd79eb6dae676&')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coordenadas')
        .setDescription('Mostras as Coordenadas OverWorld, EndsCity, Nether'),

    async execute(interaction) {

        const select = new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Selecione')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Ends Citys')
                    .setDescription('Mostra as Coordenadas das Ends Citys')
                    .setValue('endscitys'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Nether')
                    .setDescription('Mostra as coordenadas dos ponto importantes no Nether')
                    .setValue('nether'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('OverWorld')
                    .setDescription('Mostras as coordenadas dos pontos importantes no OverWorld')
                    .setValue('overworld')
            )

        const Button = new ActionRowBuilder()
            .addComponents(select)

        await interaction.reply({ embeds: [Coordenadas], components: [Button] })
    }
}