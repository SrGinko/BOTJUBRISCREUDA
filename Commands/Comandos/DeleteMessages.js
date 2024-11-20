const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { addXp, addLVL } = require('../../Controller')

const embed = new EmbedBuilder()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Deletar mensagens')
        .addIntegerOption(option => option.setName('quantidade').setDescription('Insira a quantidade de mensagens que será deletada (Forneça um número entre 1 e 100)').setRequired(true)),


    async execute(interaction) {

        const userId = interaction.user.id
        const { options } = interaction

        const quantidade = options.getInteger('quantidade')

            const member = interaction.member
            const lixeiro = member.roles.cache.some(r => r.name === 'Lixeiro')
            const platina = member.roles.cache.some(r => r.name === 'Falador Platina')
            const diamante = member.roles.cache.some(r => r.name === 'Falador Diamante')

            if (lixeiro === true || platina === true || diamante === true) {
                if (quantidade < 1 || quantidade > 100) {
                    embed.setDescription(`Por favor, forneça um número entre 1 e 100.`)
                    embed.setColor('Red')

                } else {
                    const deletedMessages = await interaction.channel.bulkDelete(quantidade);

                    embed.setDescription(`Excluídas **${deletedMessages.size}** mensagens.`)
                    embed.setColor('Green')
                    addXp(userId, 20)
                    addLVL(userId)
                }
            } else if (lixeiro === false) {

                embed.setDescription(`Você não tem permição de Lixeiro para executar este comando!`)
                embed.setColor('Red')
            }
        interaction.reply({ embeds: [embed], ephemeral: true });

    }
}
