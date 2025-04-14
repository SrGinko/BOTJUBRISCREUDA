const { SlashCommandBuilder, AttachmentBuilder, } = require("discord.js")
const { Hoje, addLVL, ranking, Banner } = require("../../Controller")
const Canvas = require('@napi-rs/canvas');
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()
const { URL_USUARIO } = process.env


module.exports = {
    data: new SlashCommandBuilder()
        .setName('perfil')
        .setDescription('Consultar seu Nível e quantidade de XP'),

    async execute(interaction) {

        try {
            await interaction.deferReply();
            await interaction.channel.sendTyping();

            const userId = interaction.user.id
            const memeber = interaction.member
            const ServerBooster = memeber.roles.cache.some(r => r.name === 'Burgês') 

            const response = await axios.get(`${URL_USUARIO}/${userId}`)

            const user = response.data

            allUsers = await ranking()

            const IdUser = allUsers.map(i => i.id)
            const Ranking = IdUser.indexOf(userId) + 1

            const banners = await Banner(user.wallpaper)

            var maxXp = await addLVL(userId)
            const agora = Hoje()

            const larguraBarra = 200;
            const alturaBarra = 15;
            const canvas = Canvas.createCanvas(700, 250);
            const context = canvas.getContext('2d');

            var background = await Canvas.loadImage(banners.banner)

            const porcentagemXP = user.xp / maxXp;

            if (maxXp >= 10000) {
                maxXp = maxXp.toString()
                maxXp = maxXp.slice(0, 2) + 'K'
            }

            const larguraPreenchida = larguraBarra * porcentagemXP;

            context.drawImage(background, 0, 0, 700, 250)
            if(banners.banner === 'https://www.riotgames.com/darkroom/1440/056b96aab9c107bfb72c1cc818be712a:8e765b8b8b63d537b82096f248c2f169/tf-graves-pride-0.png'){
                context.filter = 'blur(2px)'
            }

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

            if(ServerBooster === true){
                const booster = await Canvas.loadImage('./src/Assets/booster.png');
                context.drawImage(booster, canvas.width / 2.6, canvas.height / 3.1 , 32, 32)
                console.log('Booster')  
            }
            
            context.font = '20px  "OpenSans"';
            context.fillStyle = '#ffffff';
            context.fillText(`Nível / `, canvas.width / 1.25, canvas.height / 3.8);
            context.font = '28px "OpenSans"';
            context.fillStyle = `${banners.cor}`;
            context.fillText(`#${user.nivel}`, canvas.width / 1.1, canvas.height / 3.8);

            context.font = '20px  "OpenSans"';
            context.fillStyle = '#ffffff';
            context.fillText(`TOP/ `, canvas.width / 1.25, canvas.height / 1.9);
            context.font = '30px "OpenSans"';
            context.fillStyle = `#43fef5`;
            context.fillText(`#${Ranking}`, canvas.width / 1.1, canvas.height / 1.9);

            context.font = '15px "OpenSans"';
            context.fillStyle = '#ffffff';
            context.fillText(`XP: `, canvas.width / 2.55, canvas.height / 1.5);
            context.font = '20px "OpenSans"';
            context.fillStyle = '#43fef5';
            context.fillText(` #${Math.round(user.xp)} / #${maxXp}`, canvas.width / 2.33, canvas.height / 1.5);

            context.fillStyle = '#444241';
            context.fillRect(canvas.width / 2.5, canvas.height / 1.3 - alturaBarra / 1.3, larguraBarra, alturaBarra);

            context.fillStyle = `${banners.cor}`;
            context.fillRect(canvas.width / 2.5, canvas.height / 1.3 - alturaBarra / 1.3, larguraPreenchida, alturaBarra);

            context.font = '28px "OpenSans"';
            context.fillStyle = '#ffffff';
            context.fillText(`${user.username}`, canvas.width / 2.5, canvas.height / 3.8);

            context.font = '12px "OpenSans"';
            context.fillStyle = `#ffffff`;
            context.fillText(`By Jubriscreuda  ${agora.ano}`, canvas.width / 1.3, canvas.height / 1.1);

            const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });

            await interaction.editReply({ files: [attachment] })

        } catch (error) {
            console.log(error)

        }
    }

}
