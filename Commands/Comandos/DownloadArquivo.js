const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js")
const fs = require('fs')
const path = require('path');
const db = require('../../db')
const { addXp } = require('../../Controller')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('down')
        .setDescription('Puxar o arquivo do banco de dados por ID')
        .addIntegerOption(option => option.setName('id').setDescription('Id do arquivo').setRequired(true)),


    async execute(interaction) {
        const userId = interaction.user.id
        const { options } = interaction

        const id = options.getInteger('id')

        try {
            const select = db.prepare(`SELECT filename, content from files WHERE id = ?`)
            const data = select.get(id)

            const tempDir = './temp';
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir);
            }
            const filePath = path.join(tempDir, data.filename);

            fs.writeFile(filePath, data.content, async (err) => {
                if (err) {
                    console.error(err);
                    interaction.reply({ content: 'Erro ao salvar o arquivo temporário.', ephemeral: true });
                    return;
                }
            })


            const arquivo = new AttachmentBuilder(filePath)

            addXp(userId, 25)
            await interaction.channel.sendTyping();
            await interaction.reply({ files: [arquivo] })

            fs.unlink(filePath, (err) => {
                if (err) console.error('Erro ao remover o arquivo temporário:', err);
            });

        } catch (error) {
            console.log(error)
        }


    }

}