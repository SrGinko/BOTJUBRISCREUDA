const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const db = require('../../db')

const embed = new EmbedBuilder()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletusr')
        .setDescription('Deletar um usuário do banco de dados')
        .addStringOption(option => option.setName('usuario').setDescription('Adicionar id do Usuario').setRequired(true)),

    async execute(interaction) {

        const { options } = interaction

        const userId = options.getString('usuario')

        const member = interaction.member
        const adm = member.guild.roles.cache.some(r => r.name === 'Adm')

        if (adm === true) {
            const sumt = db.prepare(`DELETE FROM users WHERE id = ?`)

            try {
                sumt.run(userId)

                embed.setColor('Green')
                embed.setDescription('Usuário deletado com sucesso!')

            } catch (error) {
                console.log(error)
            }

        } else if (adm === false) {
            embed.setColor('Red')
            embed.setDescription('Você não tem permissão para usar este Comando!')
        }

        await interaction.channel.sendTyping();
        await interaction.reply({ embeds: [embed], ephemeral: true })

    }

}
