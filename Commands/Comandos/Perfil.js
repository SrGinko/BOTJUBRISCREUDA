const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js")
const db = require('../../db')
const { Hoje, addLVL } = require("../../Controller")
const Canvas = require('@napi-rs/canvas');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('perfil')
        .setDescription('Consultar seu Nível e quantidade de XP'),

    async execute(interaction) {
        const userId = interaction.user.id

        const sumt = db.prepare(`SELECT * from users WHERE id = ?`)
        const user = sumt.get(userId)
        const username = user.username



        try {
            const cores = [
                { cor: '#b30003' },
                { cor: '#1bb300' },
                { cor: '#a87900' },
                { cor: '#00ccb1' },
            ]


            const maxXp = await addLVL(userId)

            const indice = Math.floor(Math.random() * 4)

            const agora = Hoje()


            const larguraBarra = 200;
            const alturaBarra = 15;
            const canvas = Canvas.createCanvas(700, 250);
            const context = canvas.getContext('2d');

            var background
            var banner = user.fundo

            if (banner === '1') {
                background = await Canvas.loadImage('https://img.pikbest.com/backgrounds/20190710/simple-solid-color-black-background-banner_2753863.jpg!bw700')
            }else{
                background = await Canvas.loadImage(banner)
            }


            const porcentagemXP = user.xp / maxXp;
            const larguraPreenchida = larguraBarra * porcentagemXP;

            context.drawImage(background, 0, 0, 700, 250)
            context.filter = 'blur(5px)'
            context.drawImage(background, 0, 0, 700, 250)
            context.filter = 'none'

            const avatar = await Canvas.loadImage(interaction.user.displayAvatarURL({ extension: 'jpg' }));
            context.save();
            context.beginPath();
            context.arc(125, 125, 100, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();
            context.drawImage(avatar, 20, 20, 200, 200);
            context.restore();

            const usuario = 'Usuário'

            context.font = '20px  Ubuntu';
            context.fillStyle = '#ffffff';
            context.fillText(`Nível / `, canvas.width / 1.25, canvas.height / 3.8);
            context.font = '28px Ubuntu';
            context.fillStyle = '#be81d5';
            context.fillText(` #${user.lvl}`, canvas.width / 1.1, canvas.height / 3.8);

            context.font = '15px Ubuntu';
            context.fillStyle = '#ffffff';
            context.fillText(`XP: `, canvas.width / 2.55, canvas.height / 1.5);
            context.font = '20px Ubuntu';
            context.fillStyle = '#43fef5';
            context.fillText(` #${user.xp} /`, canvas.width / 2.33, canvas.height / 1.5);
            context.font = '18px Ubuntu';
            context.fillStyle = '#4f504e';
            context.fillText(` #${maxXp}`, canvas.width / 1.8, canvas.height / 1.5);

            context.fillStyle = '#444241';
            context.fillRect(canvas.width / 2.5, canvas.height / 1.3 - alturaBarra / 1.3, larguraBarra, alturaBarra);

            context.fillStyle = '#2b5d8c';
            context.fillRect(canvas.width / 2.5, canvas.height / 1.3 - alturaBarra / 1.3, larguraPreenchida, alturaBarra);

            context.font = '28px Ubuntu';
            context.fillStyle = '#ffffff';
            context.fillText(`${user.username}`, canvas.width / 2.5, canvas.height / 3.8);

            context.font = '12px Ubuntu';
            context.fillStyle = `${cores[indice].cor}`;
            context.fillText(`By Jubriscreuda  ${agora.ano}`, canvas.width / 1.3, canvas.height / 1.1);

            const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });


            await interaction.channel.sendTyping();
            await interaction.reply({ files: [attachment] })

        } catch (error) {
            console.log(error)
        }
    }

}
