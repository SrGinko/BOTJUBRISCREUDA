const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js")
const db = require('../../db')
const Canvas = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('perfil2')
        .setDescription('Consultar seu Nível e quantidade de XP'),

    async execute(interaction) {

            const userId = interaction.user.id

            const smt = db.prepare(`SELECT * FROM users WHERE id = ?`)
            const user = smt.get(userId)

            const canvas = Canvas.createCanvas(700, 250);
            const context = canvas.getContext('2d');

            // Fundo do card
            context.fillStyle = '#2f3237';
            context.fillRect(0, 0, canvas.width, canvas.height);

            // Foto de perfil do usuário
            const avatar = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'jpg' }));
            context.save();
            context.beginPath();
            context.arc(125, 125, 50, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();
            context.drawImage(avatar, 75, 75, 100, 100);
            context.restore();

            // Nome do usuário
            context.fillStyle = '#ffffff';
            context.font = '28px Arial';
            context.fillText(interaction.user.username, 200, 100);

            // Nível e Classificação
            context.font = '22px Arial';
            context.fillStyle = '#ffffffaa';
            context.fillText('NÍVEL', 200, 140);
            context.fillStyle = '#00b8ff';
            context.fillText(`${user.lvl}`, 280, 140);

            // Barra de XP
            const requiredXP = user.lvl * 500;
            const xpPercentage = (user.xp / requiredXP) * 100;

            context.fillStyle = '#3d3f43';
            context.fillRect(200, 170, 400, 20);
            context.fillStyle = '#00b8ff';
            context.fillRect(200, 170, 4 * xpPercentage, 20); // Progresso do XP (com base na porcentagem)

            // Texto de XP
            context.font = '18px Arial';
            context.fillStyle = '#ffffffaa';
            context.fillText(`${user.xp} / ${requiredXP} XP`, 200, 210);

            // Enviar o card como um anexo no Discord.
            const attachment = new AttachmentBuilder(canvas.encode('jpg'), { name: 'rank-card.jpg' });
            interaction.reply({ files: [attachment] });

    }

}
