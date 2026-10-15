import { EmbedBuilder, MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { api } from '../../../service/axiosClient'
import { addXp } from '../../../Utils/xp'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('criarheroi')
        .setDescription('Crie seu herói')
        .addStringOption(option => option
            .setName('nome')
            .setDescription('Nome do seu herói')
            .setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral })
        if (!interaction.guild) {
            return interaction.editReply({ content: 'Este comando só pode ser usado em um servidor.' })
        }

        const heroName = interaction.options.getString('nome', true).trim()
        if (!heroName) return interaction.editReply({ content: 'Informe um nome válido para o herói.' })

        try {
            await api.post('/heroi', { nome: heroName, userID: interaction.user.id })
            const rpgRole = interaction.guild.roles.cache.find(role => role.name === 'RPG')
            if (rpgRole) {
                const member = await interaction.guild.members.fetch(interaction.user.id)
                await member.roles.add(rpgRole)
            }

            const embed = new EmbedBuilder()
                .setTitle('Herói criado com sucesso! ✅')
                .setColor('Green')
                .setTimestamp()
                .setFooter({
                    text: 'By Jubriscreuda',
                    iconURL: 'https://i.ytimg.com/vi/s6V4BjURhOs/maxresdefault.jpg',
                })
            void addXp(interaction.user.id, 100).catch(console.error)
            return interaction.editReply({ embeds: [embed] })
        } catch (error) {
            console.error('Erro ao criar herói:', error)
            return interaction.editReply({ content: 'Não foi possível criar o herói. Tente novamente mais tarde.' })
        }
    },
}
