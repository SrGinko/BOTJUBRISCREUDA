const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

const Coordenadas = new EmbedBuilder()
    .setTitle('Alteração do Banner')
    .setColor('Random')
    .setDescription('Selecione o Banner')
    .setTimestamp()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('alterbanner')
        .setDescription('Alteração do banner do perfil'),

    async execute(interaction) {
        try {

            const select = new StringSelectMenuBuilder()
                .setCustomId('alterbanner')
                .setPlaceholder('Selecione')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Wave')
                        .setDescription('Wave by SrGinko')
                        .setValue('0'),

                    new StringSelectMenuOptionBuilder()
                        .setLabel('Outono')
                        .setDescription('Outono by SrGinko')
                        .setValue('1'),

                    new StringSelectMenuOptionBuilder()
                        .setLabel('Hacker')
                        .setDescription('Hacker by SrGinko')
                        .setValue('2'),

                    new StringSelectMenuOptionBuilder()
                        .setLabel('Montanhas')
                        .setDescription('Montanhas by SrGinko')
                        .setValue('3'),

                    new StringSelectMenuOptionBuilder()
                        .setLabel('Floresta')
                        .setDescription('Floresta by SrGinko')
                        .setValue('4'),

                    new StringSelectMenuOptionBuilder()
                        .setLabel('Astronalta')
                        .setDescription('Astronalta by SrGinko')
                        .setValue('5'),

                    new StringSelectMenuOptionBuilder()
                        .setLabel('Folha')
                        .setDescription('Folha by SrGinko')
                        .setValue('6'),

                    new StringSelectMenuOptionBuilder()
                        .setLabel('Samael')
                        .setDescription('Samael by Wesley')
                        .setValue('7'),

                    new StringSelectMenuOptionBuilder()
                        .setLabel('Vaquinha')
                        .setDescription('+18 by Wesley')
                        .setValue('8'),

                    new StringSelectMenuOptionBuilder()
                        .setLabel('Imperfection')
                        .setDescription('imperfection by Wesley')
                        .setValue('9'),

                    new StringSelectMenuOptionBuilder()
                        .setLabel('Neblina')
                        .setDescription('Neblina by SrGinko')
                        .setValue('10'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('LOL')
                        .setDescription('by Jabiroco')
                        .setValue('11'),

                    new StringSelectMenuOptionBuilder()
                        .setLabel('Skull Sea Of Thieves')
                        .setDescription('by SrGinko')
                        .setValue('12'),

                    new StringSelectMenuOptionBuilder()
                        .setLabel('Hajime no Ippo')
                        .setDescription('by LordeEscanor225')
                        .setValue('13'),
                )

            const Button = new ActionRowBuilder()
                .addComponents(select)

            await interaction.reply({ embeds: [Coordenadas], components: [Button] })
        } catch (error) {
            console.log(error)
        }
    }
}