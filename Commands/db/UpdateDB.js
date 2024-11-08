const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const db = require('../../db')

const embed = new EmbedBuilder()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('updatedb')
        .setDescription('Atualizar dados do BD')
        .addStringOption(option => option.setName('id').setDescription('Adicionar id').setRequired(true))
        .addStringOption(option => option.setName('tabela').setDescription('Selecionar tabela').setRequired(true))
        .addStringOption(option => option.setName('entidade').setDescription('Selecionar a entidade').setRequired(true))
        .addStringOption(option => option.setName('valor').setDescription('Altera o valor').setRequired(true)),

    async execute(interaction) {

        const { options } = interaction

        const userId = options.getString('id')
        const tabela = options.getString('tabela')
        const entidade = options.getString('entidade')
        const valor = options.getString('valor')

        const member = interaction.member
        const adm = member.guild.roles.cache.some(r => r.name === 'Adm')

        if (adm === true) {

            try {
                const updateLvl = db.prepare(`UPDATE ${tabela} SET ${entidade} = ? WHERE id = ?`)

                updateLvl.run(valor, userId)

                embed.setColor('Green')
                embed.setDescription('Usuário Atualizado com sucesso!')

            } catch (error) {
                console.log(error)
                embed.setColor('Red')
                embed.setDescription('Ocorreu algum erro!')
            }

        } else if (adm === false) {
            embed.setColor('Red')
            embed.setDescription('Você não tem permissão para usar este Comando!')
        }

        await interaction.channel.sendTyping();
        await interaction.reply({ embeds: [embed], ephemeral: true })

    }
}
