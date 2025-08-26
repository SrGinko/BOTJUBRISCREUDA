const { SlashCommandBuilder, AttachmentBuilder, MediaGalleryBuilder, ContainerBuilder, MessageFlags, ThumbnailBuilder, SectionBuilder, TextDisplayBuilder } = require("discord.js")
const { getEmoji } = require("../../Utils/emojis");
const Canvas = require('@napi-rs/canvas');
const { Hoje } = require("../../Utils/date");
const { addLVL } = require("../../Utils/xp");
const banners = require("../../data/banners");
const { ranking } = require("../../Controller");
const api = require("../../Utils/axiosClient");

function formatXp(xp) {
    const unidades = ['', 'K', 'M', 'B', 'T']

    xp = parseInt(xp)

    let index = 0;
    while (xp >= 1000 && index < unidades.length - 1) {
        xp /= 1000;
        index++;
    }

    return `${xp.toFixed(1)}${unidades[index]}`
}

function formatUserXp(xp) {
    const unidades = ['', 'K', 'M', 'B', 'T']

    xp = parseInt(xp)

    let index = 0;
    while (xp >= 1000 && index < unidades.length - 1) {
        xp /= 1000;
        index++;
    }

    return `${xp.toFixed(1)}${unidades[index]}`
}



module.exports = {
    data: new SlashCommandBuilder()
        .setName('perfil')
        .setDescription('Consultar seu Nível e quantidade de XP'),


    async execute(interaction) {

        try {
            await interaction.deferReply();

            const userId = interaction.user.id
            const member = interaction.member
            const dataEntrada = member.joinedAt.toLocaleDateString('pt-BR', {
                timeZone: 'America/Sao_Paulo'

            });

            const nomeCargos = member.roles.cache.filter(role => role.name !== '@everyone').map(role => role.name);

            const emojis = nomeCargos.map(cargo => getEmoji(cargo)).filter(emojis => emojis?.trim()).join(' ');

            const response = await api.get(`/usuario/${userId}`)

            const user = response.data

            allUsers = await ranking()

            const IdUser = allUsers.map(i => i.id)
            const Ranking = IdUser.indexOf(userId) + 1

            const banner = banners

            var maxXp = await addLVL(userId)
            const agora = await Hoje()

            const larguraBarra = 200;
            const alturaBarra = 15;
            const canvas = Canvas.createCanvas(700, 250);
            const context = canvas.getContext('2d');

            var background = await Canvas.loadImage(banner[user.wallpaper].banner)

            const porcentagemXP = user.xp / maxXp;

            maxXp = formatXp(maxXp)
           let userXp = formatUserXp(user.xp)

            const larguraPreenchida = larguraBarra * porcentagemXP;

            context.drawImage(background, 0, 0, 700, 250)
            if (banner[user.wallpaper].banner === 'https://www.riotgames.com/darkroom/1440/056b96aab9c107bfb72c1cc818be712a:8e765b8b8b63d537b82096f248c2f169/tf-graves-pride-0.png') {
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

            context.font = '20px  "OpenSans"';
            context.fillStyle = '#ffffff';
            context.fillText(`Nível / `, canvas.width / 1.25, canvas.height / 3.8);
            context.font = '28px "OpenSans"';
            context.fillStyle = `${banner[user.wallpaper].cor}`;
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
            context.fillText(` #${userXp} / #${maxXp}`, canvas.width / 2.33, canvas.height / 1.5);

            context.fillStyle = '#444241';
            context.fillRect(canvas.width / 2.5, canvas.height / 1.3 - alturaBarra / 1.3, larguraBarra, alturaBarra);

            context.fillStyle = `${banner[user.wallpaper].cor}`;
            context.fillRect(canvas.width / 2.5, canvas.height / 1.3 - alturaBarra / 1.3, larguraPreenchida, alturaBarra);

            context.font = '28px "OpenSans"';
            context.fillStyle = '#ffffff';
            context.fillText(`${user.username}`, canvas.width / 2.5, canvas.height / 3.8);

            context.font = '12px "OpenSans"';
            context.fillStyle = `#ffffff`;
            context.fillText(`By Jubriscreuda  ${agora.ano}`, canvas.width / 1.3, canvas.height / 1.1);

            const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });

            const conteiner = new ContainerBuilder({
                accent_color: banner[user.wallpaper].corHEX,
                timestamp: true,
                components: [
                    new MediaGalleryBuilder({
                        items: [
                            {
                                media: {
                                    url: `attachment://profile-image.png`
                                }
                            }
                        ]
                    }),
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder({
                                content: `**Tags:** ${emojis} **Usuário desde:** \`\`${dataEntrada}\`\` \n \`\`\`${user.Descricao}\`\`\` \n **Mensagens enviadas:** \`\`${user.quantidadeMensagens}\`\``
                            })
                        )
                        .setThumbnailAccessory(
                            new ThumbnailBuilder({
                                media: { url: `${user.foto}` }
                            })
                        )
                ]
            })

            await interaction.editReply({ flags: [MessageFlags.IsComponentsV2], components: [conteiner], files: [attachment] })

        } catch (error) {
            console.log(error)

        }
    }
}
