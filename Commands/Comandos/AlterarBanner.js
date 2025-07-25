const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags } = require('discord.js');
const { Banner, controler } = require('../../Controller');
const { getRandonCores } = require('../../Utils/cores');

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
            const banners = await Banner()

            const select = new StringSelectMenuBuilder()
                .setCustomId('alterbanner')
                .setPlaceholder('Selecione')
                .addOptions(
                    banners.map(item => ({
                        label: item.name,
                        value: item.id
                    }))
                )
            const Button = new ActionRowBuilder()
                .addComponents(select)

            const cor = getRandonCores()

            const conteiner = new ContainerBuilder({
                accent_color: cor,
                timestamp: true,
                components: [
                    new TextDisplayBuilder({
                        content: '# Selecione o banner desejado!\n Você pode alterar o banner a qualquer momento!',
                        style: 'Short',
                    }),
                    Button
                ]
            })

            await interaction.reply({ flags: [MessageFlags.IsComponentsV2], components: [conteiner] })
        } catch (error) {
            console.log(error)
        }
    }
}