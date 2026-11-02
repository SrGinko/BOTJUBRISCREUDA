import { EmbedBuilder, MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { addXp } from '../../Utils/xp'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Deletar mensagens')
        .addIntegerOption(option => option
            .setName('quantidade')
            .setDescription('Insira a quantidade de mensagens que será deletada (Forneça um número entre 1 e 100)')
            .setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        const { user, options, channel } = interaction
        const quantidade = options.getInteger('quantidade', true)
        const member = interaction.guild?.members.cache.get(user.id)
        const embed = new EmbedBuilder()

        if (!member) {
            return interaction.reply({ content: 'Este comando só pode ser usado em um servidor.', flags: MessageFlags.Ephemeral })
        }

        const lixeiro = member.roles.cache.some(role => role.name === 'Lixeiro')
        const platina = member.roles.cache.some(role => role.name === 'Falador Platina')
        const diamante = member.roles.cache.some(role => role.name === 'Falador Diamante')

        if (lixeiro || platina || diamante) {
            if (quantidade < 1 || quantidade > 100) {
                embed.setDescription('Por favor, forneça um número entre 1 e 100.')
                embed.setColor('Red')
                return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
            }

            if (!channel || !('bulkDelete' in channel) || typeof channel.bulkDelete !== 'function') {
                return interaction.reply({ content: 'Não foi possível excluir mensagens neste canal.', flags: MessageFlags.Ephemeral })
            }

            const deletedMessages = await channel.bulkDelete(quantidade)
            embed.setDescription(`Excluídas **${deletedMessages.size}** mensagens.`)
            embed.setColor('Green')
            void addXp(user.id, deletedMessages.size * 5)
            return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
        }

        embed.setDescription('Você não tem permissão de Lixeiro para executar este comando!')
        embed.setColor('Red')
        return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
    },
}
