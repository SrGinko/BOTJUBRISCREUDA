const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

const Coordenadas = new EmbedBuilder()
    .setTitle('Alteração do Banner')
    .setColor('Random')
    .setDescription('Selecione o Banner')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('alterbanner')
        .setDescription('Alteração do banner do perfil'),

    async execute(interaction) {
        try {

            const select = new StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Selecione')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Wave')
                        .setDescription('Wave')
                        .setValue('0'),

                    new StringSelectMenuOptionBuilder()
                        .setLabel('Outono')
                        .setDescription('Outono')
                        .setValue('1'),

                    new StringSelectMenuOptionBuilder()
                        .setLabel('Hacker')
                        .setDescription('Hacker')
                        .setValue('2'),

                    new StringSelectMenuOptionBuilder()
                        .setLabel('Montanhas')
                        .setDescription('Montanhas')
                        .setValue('3'),

                    new StringSelectMenuOptionBuilder()
                        .setLabel('Floresta')
                        .setDescription('Floresta')
                        .setValue('4'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Astronalta')
                        .setDescription('Astronalta')
                        .setValue('5'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Folha')
                        .setDescription('Folha')
                        .setValue('6'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Samael')
                        .setDescription('Samael')
                        .setValue('7'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Vaquinha')
                        .setDescription('Vaquinha')
                        .setValue('8'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Imperfection')
                        .setDescription('imperfection')
                        .setValue('9'),
                )

            const Button = new ActionRowBuilder()
                .addComponents(select)

            await interaction.reply({ embeds: [Coordenadas], components: [Button] })
        } catch (error) {
            console.log(error)
        }
    }
}