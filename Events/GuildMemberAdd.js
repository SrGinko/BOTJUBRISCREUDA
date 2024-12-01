const { Events, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { Hoje } = require('../Controller')
const Canvas = require('@napi-rs/canvas');
const db = require('../db');

const embed = new EmbedBuilder()
    .setColor('Random')

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

            const banners = [
                { banner: 'https://t4.ftcdn.net/jpg/06/45/12/47/360_F_645124745_3CGfuoRYiXRME36HMs4EFvr0qjeejuhV.jpg' },
                { banner: 'https://wallpapers.com/images/featured/4k-minimalista-2dpumtq7d6vnq2fv.jpg' },
                { banner: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIGgpqwiMDOC_lnHXGgDQgYduap-y6C4TqgoXCmyQctqTnp2AouHCLO0pwEmgAXwu-F3w&usqp=CAU' },
                { banner: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTouyrbJzJZPnrtdcvmjrPmH3hClu7EuJZuJqB0MPJqCWrmCtfJYtQ5cE-rxs76GTaEOxM&usqp=CAU' },
                { banner: 'https://img.freepik.com/fotos-premium/imagens-de-papel-de-parede-em-4k_655257-1108.jpg' },
                { banner: 'https://cdn.discordapp.com/attachments/1119014051033403473/1237802264719003739/image.png?ex=672f8cb1&is=672e3b31&hm=739a59b8238555ab5435994adf2182c7432cdaa6cc678fbdf42d6a9b82ffef70&' },
                { banner: 'https://img.freepik.com/fotos-gratis/beleza-abstrata-de-outono-em-padrao-multicolorido-de-veios-de-folhas-gerado-por-ia_188544-9871.jpg' }
            ]

            const indice = Math.floor(Math.random() * 6)

            const canvas = Canvas.createCanvas(700, 250);
            const context = canvas.getContext('2d');

            const background = await Canvas.loadImage(banners[indice].banner)

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

            context.font = '25px Ubuntu';
            context.fillStyle = '#ffffff';
            context.fillText(`${member.user.globalName}`, canvas.width / 2.4, canvas.height / 4.9);

            context.font = '12px Ubuntu';
            context.fillStyle = `#ffffff`;
            context.fillText(`By Jubriscreuda  ${agora.ano}`, canvas.width / 1.3, canvas.height / 1.1);

            const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'BemVindo-image.png' });

            await member.roles.add(jogoGratis)
            await member.roles.add(player)
            channel.send({ content: `Bem Vindo(a) ${member.user}`, files: [attachment] })

            try {
                const stmt = db.prepare(`
                  INSERT INTO users (id, username, xp, lvl, fundo) 
                  VALUES (?, ?, ?, ?)
                `);
                stmt.run(userId, username, 0, 1, 1);

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