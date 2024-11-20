const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const db = require('../../db')

const embed = new EmbedBuilder()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('altername')
        .setDescription('Alterar nome da Tabela')
        .addStringOption(option => option.setName('tabela').setDescription('Nome da tabela que você quer altera').addChoices(
            { name: 'Users', value: 'users' },
            { name: 'Files', value: 'files' }
        ).setRequired(true))
        .addStringOption(option => option.setName('nomeantigo').setDescription('Selecionar qual tabela irá adicionar').setRequired(true))
        .addStringOption(option => option.setName('nomenovo').setDescription('Selecione o novo nome da tabela').setRequired(true)),

    async execute(interaction) {

        const { options } = interaction

        const tabela = options.getString('tabela')
        const nomeAntigo = options.getString('nomeantigo')
        const nomeNovo = options.getString('nomenovo')

        console.log(nomeAntigo, nomeNovo)

        const member = interaction.member
        const adm = member.guild.roles.cache.some(r => r.name === 'Adm')

        if (adm === true) {

            try {
                const alterTable = db.prepare(`ALTER TABLE ${tabela} RENAME COLUMN ${nomeAntigo} TO ${nomeNovo} `)

                alterTable.run()

                embed.setColor('Green')
                embed.setDescription('Coluna criada com sucesso!')

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
