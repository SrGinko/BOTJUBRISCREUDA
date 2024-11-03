const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const db = require('../../db')

const embed = new EmbedBuilder()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('updatelvl')
        .setDescription('Atualiza dados do BD')
        .addStringOption(option => option.setName('id').setDescription('Adicionar id').setRequired(true))
        .addIntegerOption(option => option.setName('nivel').setDescription('Modificar novo nível').setRequired(true)),

    async execute(interaction) {

        const { options } = interaction

        const userId = options.getString('id')
        const nivel = options.getInteger('nivel')

        const member = interaction.member
        const adm = member.guild.roles.cache.some(r => r.name === 'Adm')

        if (adm === true) {

            try {
                const updateLvl = db.prepare(`UPDATE users SET lvl = ? WHERE id = ?`)

                updateLvl.run(nivel, userId)

                embed.setColor('Green')
                embed.setDescription('Usuário Atualizado com sucesso!')

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
