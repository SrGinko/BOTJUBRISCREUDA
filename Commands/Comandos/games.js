const { SlashCommandBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")
const Canvas = require('@napi-rs/canvas');
const { Buscarjogo, addXp, addLVL } = require("../../Controller")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('games')
        .setDescription('Busca algumas informações de um determinado jogo')
        .addStringOption(option => option.setName('game').setDescription('Insira o nome do jogo').setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply()

        const { options } = interaction
        const userId = interaction.user.id

        const nameGame = options.getString('game')

        try {
            const response = await Buscarjogo(nameGame)
            const jogo = response.find(resp => resp.name === nameGame)

            generos = jogo.genres.map(genero => genero.name)
            const tag = jogo.tags.map(element => {
                if (element.language === 'eng') {

                    var teste = element.name
                }
                return teste
            });

            const canvas = Canvas.createCanvas(1200, 1000);
            const context = canvas.getContext('2d');

            var background = await Canvas.loadImage(jogo.background_image)

            context.drawImage(background, 0, 0, canvas.width, canvas.height);

            const gradient = context.createLinearGradient(0, canvas.height, 0, 0)
            gradient.addColorStop(0, 'rgba(0,0,0,1')
            gradient.addColorStop(0.4, 'rgba(0,0,0,0.9')
            gradient.addColorStop(1, 'rgba(0,0,0,0)')

            context.fillStyle = gradient
            context.fillRect(0, 0, canvas.width, canvas.height)

            context.font = '50px';
            context.fillStyle = '#ffffff';
            context.fillText(`🎮 ${jogo.name}`, canvas.width / 9.25, canvas.height / 1.6);
            context.font = '32px';
            context.fillStyle = '#ffffff';
            context.fillText(`Gênero: ${generos}`, canvas.width / 9.25, canvas.height / 1.4);
            if (tag.length > 4) {

                const tags = tag.filter(element => element !== undefined)
                const pt1 = tags.slice(0, 5)
                context.font = '32px';
                context.fillText(`Tags: ${pt1}`, canvas.width / 9.25, canvas.height / 1.3);
            } else {
                context.font = '32px';
                context.fillText(`Tags: ${tag}`, canvas.width / 9.25, canvas.height / 1.3);
            }
            context.font = '28px';
            context.fillStyle = '#ffffff';
            context.fillText(`Lançamento: ${jogo.released}`, canvas.width / 1.5, canvas.height / 1.1);

            context.fillStyle = '#01ae00';
            context.fillRect(canvas.width / 1.2, canvas.height / 2.2, 80, 80);
            context.font = '38px';
            context.fillStyle = '#ffffff';
            context.fillText(`${jogo.metacritic}`, canvas.width / 1.17, canvas.height / 1.95);

            const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'game-image.png' });

            const imagens = new ButtonBuilder()
                .setCustomId(nameGame)
                .setLabel('Imagens')
                .setStyle(ButtonStyle.Primary)

            const excluir = new ButtonBuilder()
                .setCustomId('excluir')
                .setLabel('Excluir')
                .setStyle(ButtonStyle.Danger)

            const row = new ActionRowBuilder()
                .addComponents(imagens, excluir)

            await interaction.channel.sendTyping();
            addXp(userId, 5)
            addLVL(userId)
            await interaction.editReply({ files: [attachment], components: [row] })

        } catch (error) {
            console.log(error)
        }

    }
}