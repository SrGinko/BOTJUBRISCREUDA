const { SlashCommandBuilder, AttachmentBuilder, range } = require("discord.js")
const db = require('../../db')
const { Hoje, addLVL, ranking } = require("../../Controller")
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
            const userIndice = IdUser.indexOf(id) + 1
            console.log(userIndice)

            const banners = [
                { banner: 'https://marketplace.canva.com/EAF_ZFGfAwE/1/0/1600w/canva-banner-para-twitch-montanha-vintage-retr%C3%B4-roxo-nqw7QjAVpKo.jpg', cor: '#be81d5' },
                { banner: 'https://t4.ftcdn.net/jpg/06/45/12/47/360_F_645124745_3CGfuoRYiXRME36HMs4EFvr0qjeejuhV.jpg', cor: '#f74922' },
                { banner: 'https://wallpapers.com/images/featured/4k-minimalista-2dpumtq7d6vnq2fv.jpg', cor: '#ffffff' },
                { banner: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTouyrbJzJZPnrtdcvmjrPmH3hClu7EuJZuJqB0MPJqCWrmCtfJYtQ5cE-rxs76GTaEOxM&usqp=CAU', cor: '#0398ce' },
                { banner: 'https://img.freepik.com/fotos-premium/imagens-de-papel-de-parede-em-4k_655257-1108.jpg', cor: '#6628f6' },
                { banner: 'https://res.cloudinary.com/dte7upwcr/image/upload/v1677788739/blog/blog2/ia-criar-imagens/ia-criar-imagens2.jpg', cor: '#01e4ca' },
                { banner: 'https://img.freepik.com/fotos-gratis/beleza-abstrata-de-outono-em-padrao-multicolorido-de-veios-de-folhas-gerado-por-ia_188544-9871.jpg', cor: '#a20104' },
                { banner: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d6d9158f-1b03-4024-9f88-9d599c4c968a/df29tev-80fc62a5-5763-45a3-8b61-ec7f6d703924.png/v1/fit/w_600,h_240,q_70,strp/discord_banner__2__watermarked__by_gothymoth_df29tev-375w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjQwIiwicGF0aCI6IlwvZlwvZDZkOTE1OGYtMWIwMy00MDI0LTlmODgtOWQ1OTljNGM5NjhhXC9kZjI5dGV2LTgwZmM2MmE1LTU3NjMtNDVhMy04YjYxLWVjN2Y2ZDcwMzkyNC5wbmciLCJ3aWR0aCI6Ijw9NjAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.PWzYbhsRZ8zU0Xn4y16vSFFyHg4SgbHE4pEw_O7_-LQ', cor: '#741111' },
                { banner: 'https://i.pinimg.com/1200x/ad/17/d5/ad17d516ba4254ead5cb9bd2747dcc53.jpg', cor: '#9600db' },
                { banner: 'https://i.pinimg.com/originals/95/d0/3c/95d03cf844c7c024347258f8953236dd.gif', cor: '#db00a1' },
                { banner: 'https://images-ext-1.discordapp.net/external/VqkxJ18-8oJKiLMoLUyz46VNBRb1XtCQjrFbJiLfqfo/https/wallpapers.com/images/hd/calm-aesthetic-desktop-8t7o1e3i0gaoodqz.jpg?format=webp&width=1258&height=683', cor: '#2172a1' },
            ]
    
            const maxXp = await addLVL(userId)
            const agora = Hoje()
    
    
            const larguraBarra = 200;
            const alturaBarra = 15;
            const canvas = Canvas.createCanvas(700, 250);
            const context = canvas.getContext('2d');
    
            var bannerIndice = user.fundo
            var background = await Canvas.loadImage(banners[bannerIndice].banner)
    
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
            context.fillStyle = `${banners[bannerIndice].cor}`;
            context.fillText(`#${user.lvl}`, canvas.width / 1.1, canvas.height / 3.8);
    
            context.font = '20px  Ubuntu';
            context.fillStyle = '#ffffff';
            context.fillText(`TOP/ `, canvas.width / 1.25, canvas.height / 1.9);
            context.font = '30px Ubuntu';
            context.fillStyle = `#43fef5`;
            context.fillText(`#${userIndice}`, canvas.width / 1.1, canvas.height / 1.9);
    
            context.font = '15px Ubuntu';
            context.fillStyle = '#ffffff';
            context.fillText(`XP: `, canvas.width / 2.55, canvas.height / 1.5);
            context.font = '20px Ubuntu';
            context.fillStyle = '#43fef5';
            context.fillText(` #${user.xp} / #${maxXp}`, canvas.width / 2.33, canvas.height / 1.5);
    
            context.fillStyle = '#444241';
            context.fillRect(canvas.width / 2.5, canvas.height / 1.3 - alturaBarra / 1.3, larguraBarra, alturaBarra);
    
            context.fillStyle = `${banners[bannerIndice].cor}`;
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
