const { SlashCommandBuilder, AttachmentBuilder,  } = require("discord.js")
const db = require('../../db')
const { Hoje, addLVL, ranking, Banner } = require("../../Controller")
const Canvas = require('@napi-rs/canvas');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('perfil')
        .setDescription('Consultar seu Nível e quantidade de XP'),

    async execute(interaction) {

        try{

            const userId = interaction.user.id
    
            const sumt = db.prepare(`SELECT * from users WHERE id = ?`)
            const all = db.prepare(`SELECT * from users`)
            const user = sumt.get(userId)
            var allUsers = all.all()
    
            allUsers = await ranking(allUsers)
            
            const IdUser = allUsers.map(i => i.id)
            const id = Number(userId)
            const ranking = IdUser.indexOf(id) + 1

            var bannerIndice = user.fundo
            const banners = await Banner(bannerIndice)
    
            const maxXp = await addLVL(userId)
            const agora = Hoje()
    
    
            const larguraBarra = 200;
            const alturaBarra = 15;
            const canvas = Canvas.createCanvas(700, 250);
            const context = canvas.getContext('2d');
    
            var background = await Canvas.loadImage(banners.banner)
    
            const porcentagemXP = user.xp / maxXp;
            const larguraPreenchida = larguraBarra * porcentagemXP;
    
            context.drawImage(background, 0, 0, 700, 250)
            // context.filter = 'blur(5px)'
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
    
            context.font = '20px  Ubuntu';
            context.fillStyle = '#ffffff';
            context.fillText(`Nível / `, canvas.width / 1.25, canvas.height / 3.8);
            context.font = '28px Ubuntu';
            context.fillStyle = `${banners.cor}`;
            context.fillText(`#${user.lvl}`, canvas.width / 1.1, canvas.height / 3.8);
    
            context.font = '20px  Ubuntu';
            context.fillStyle = '#ffffff';
            context.fillText(`TOP/ `, canvas.width / 1.25, canvas.height / 1.9);
            context.font = '30px Ubuntu';
            context.fillStyle = `#43fef5`;
            context.fillText(`#${ranking}`, canvas.width / 1.1, canvas.height / 1.9);
    
            context.font = '15px Ubuntu';
            context.fillStyle = '#ffffff';
            context.fillText(`XP: `, canvas.width / 2.55, canvas.height / 1.5);
            context.font = '20px Ubuntu';
            context.fillStyle = '#43fef5';
            context.fillText(` #${user.xp} / #${maxXp}`, canvas.width / 2.33, canvas.height / 1.5);
    
            context.fillStyle = '#444241';
            context.fillRect(canvas.width / 2.5, canvas.height / 1.3 - alturaBarra / 1.3, larguraBarra, alturaBarra);
    
            context.fillStyle = `${banners.cor}`;
            context.fillRect(canvas.width / 2.5, canvas.height / 1.3 - alturaBarra / 1.3, larguraPreenchida, alturaBarra);
    
            context.font = '28px Ubuntu';
            context.fillStyle = '#ffffff';
            context.fillText(`${user.username}`, canvas.width / 2.5, canvas.height / 3.8);
    
            context.font = '12px Ubuntu';
            context.fillStyle = `#ffffff`;
            context.fillText(`By Jubriscreuda  ${agora.ano}`, canvas.width / 1.3, canvas.height / 1.1);
    
            const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });
    
            await interaction.channel.sendTyping();
            await interaction.deferReply();
            await interaction.editReply({ files: [attachment] })
        }catch(error){
            console.log(error)
            
        }
    }

}
