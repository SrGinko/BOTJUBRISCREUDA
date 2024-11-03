const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const axios = require('axios')
const db = require('../../db')
const { addXp } = require('../../Controller')

const embed = new EmbedBuilder()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upload')
        .setDescription('Subir um arquivo para o BD do bot')
        .addAttachmentOption(option => option.setName('file').setDescription('Salve arquivos de programação no Banco de dados').setRequired(true)),


    async execute(interaction) {
        const userId = interaction.user.id
        const { options } = interaction

        const file = options.getAttachment('file')

        const fileUrl = file.url
        const fileName = file.name
        const fileType = file.name.split('.').pop()

        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
        const fileData = response.data;
        try {
            const smt = db.prepare(`INSERT INTO files (filename, filetype, content) VALUES (?, ?, ?)`)
            smt.run(fileName, fileType, fileData)

            const select = db.prepare(`SELECT id from files WHERE content = ?`)
            const id = select.get(fileData)

            embed.setDescription(`Arquivo **${file.name}**, id **${id.id}** salvo com sucesso!`)
            embed.setColor('Green')
            addXp(userId, 20)
            
        } catch (error) {
            console.log(error)
            embed.setDescription(`Não foi possível salvar arquivo!`)
            embed.setColor('Red')
        }
        
        await interaction.reply({embeds: [embed]})
    }

}