const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags } = require('discord.js');
const { getRandonCores } = require('../../Utils/cores');
const banners = require('../../data/banners');
const { addXp } = require('../../Utils/xp');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('alterbanner')
        .setDescription('Alteração do banner do perfil'),

    async execute(interaction) {
        try {
            const banner = banners

            const select = new StringSelectMenuBuilder()
                .setCustomId('alterbanner')
                .setPlaceholder('Selecione')
                .addOptions(
                    banner.map(item => ({
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
                        content: '# Selecione o banner desejado!\n  - Você pode alterar o banner a qualquer momento!',
                        style: 'Short',
                    }),
                    Button
                ]
            })

            addXp(interaction.user.id, 10)
            await interaction.reply({ flags: [MessageFlags.IsComponentsV2], components: [conteiner] })
        } catch (error) {
            console.log(error)
        }
    }
}