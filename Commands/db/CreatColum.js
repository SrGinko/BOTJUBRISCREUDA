const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const db = require('../../db')

const embed = new EmbedBuilder()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('creatcolum')
        .setDescription('Criar uma nova coluna no BD')
        .addStringOption(option => option.setName('nome').setDescription('Adicionar nome da coluna').setRequired(true))
        .addStringOption(option => option.setName('tabela').setDescription('Selecionar qual tabela irá adicionar').setRequired(true))
        .addStringOption(option => option.setName('tipo').setDescription('Tipo de dado').setRequired(true))
        .addStringOption(option => option.setName('value').setDescription('Valor Padrão do dado').setRequired(true)),

    async execute(interaction) {

        const { options } = interaction

        const nome = options.getString('nome')
        const tabela = options.getString('tabela')
        const tipo = options.getString('tipo')
        const value = options.getString('value')

        const member = interaction.member
        const adm = member.guild.roles.cache.some(r => r.name === 'Adm')

        if (adm === true) {

            try {
                const alterTable = db.prepare(`ALTER TABLE ${tabela} ADD COLUMN ${nome} ${tipo} DEFAULT ${value} `)

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
