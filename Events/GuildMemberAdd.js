const { Events, AttachmentBuilder } = require('discord.js')
const { Hoje, Banner } = require('../Controller')
const Canvas = require('@napi-rs/canvas');
const db = require('../db');

module.exports = {
    name: Events.GuildMemberAdd,

    async execute(member) {

        const userId = member.user.id
        const username = member.user.globalName

        try {

            const player = member.guild.roles.cache.find(r => r.name === 'Players')
            const jogoGratis = member.guild.roles.cache.find(r => r.name === 'JogosGratis')
            const channel = member.guild.channels.cache.find(ch => ch.name === 'bem-vindo')

            const agora = Hoje()

            const indice = Math.floor(Math.random() * 13);
            const banners = await Banner(indice)

            const canvas = Canvas.createCanvas(700, 250);
            const context = canvas.getContext('2d');

            var background = await Canvas.loadImage(banners.banner)

            context.drawImage(background, 0, 0, 700, 250)
            context.filter = 'blur(5px)'
            context.drawImage(background, 0, 0, 700, 250)
            context.filter = 'none'

            const tamanhoImagem = 150;
            const posicaoX = (canvas.width - tamanhoImagem) / 2;
            const posicaoY = (canvas.height - tamanhoImagem) / 2;

            const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'jpg' }));
            context.save();
            context.beginPath();
            context.arc(canvas.width / 2, canvas.height / 1.9, tamanhoImagem / 2, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();
            context.drawImage(avatar, posicaoX, posicaoY, tamanhoImagem, tamanhoImagem);
            context.restore();

            context.font = '25px OpenSans';
            context.fillStyle = '#ffffff';
            context.fillText(`${member.user.globalName}`, canvas.width / 2.4, canvas.height / 4.9);

            context.font = '12px OpenSans';
            context.fillStyle = `#ffffff`;
            context.fillText(`By Jubriscreuda  ${agora.ano}`, canvas.width / 1.3, canvas.height / 1.1);

            const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'BemVindo-image.png' });

            await member.roles.add(jogoGratis)
            await member.roles.add(player)
             
            channel.send({ content: `Bem Vindo(a) ${member.user}`, files: [attachment] })

            try {
                const stmt = db.prepare(`
                  INSERT INTO users (id, username, xp, lvl, fundo) 
                  VALUES (?, ?, ?, ?, ?)
                `);
                stmt.run(userId, username, 0, 1, indice);

            } catch (error) {
                if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {

                } else {
                    console.error('Erro ao registrar usuário:', error);
                }
            }

        } catch (error) {
            console.log(error)
        }
    }
}