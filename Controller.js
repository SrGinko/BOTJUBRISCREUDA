const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, hyperlink } = require('discord.js')
const dotenv = require('dotenv')
dotenv.config()
const { RAWG_API, URL_USUARIO, URL444444444444444444444444444444 } = process.env
const axios = require('axios')

const embed = new EmbedBuilder()

const excluir = new ButtonBuilder()
    .setCustomId('excluir')
    .setLabel('Excluir')
    .setStyle(ButtonStyle.Danger)

const row = new ActionRowBuilder()
    .addComponents(excluir)

const EndCitys = new EmbedBuilder()
    .setTitle('EndsCitys')
    .setColor('Purple')
    .addFields({ name: 'Clique aqui:', value: `https://discord.com/channels/1031036294433865850/1170598801648652439` })

const Nether = new EmbedBuilder()
    .setTitle('Nether')
    .setColor('Red')
    .addFields({ name: 'Clique aqui:', value: `https://discord.com/channels/1031036294433865850/1215493202069561355` })

const OverWorld = new EmbedBuilder()
    .setTitle('OverWorld')
    .setColor('Green')
    .addFields({ name: 'Clique aqui:', value: `https://discord.com/channels/1031036294433865850/1215493397230395452` })



/**
 * 
 * @param {Objeto} interaction - Necessaria para execção dos comando
 * @returns {Objeto} - Retorna valor da interação
 */

async function controler(interaction) {

    if (interaction.isButton()) {
        const id = interaction.customId

        if (id === 'excluir') {
            interaction.message.delete()
        } else {
            const response = await Buscarjogo(id)
            const jogo = response.find(resp => resp.name === id)
            const imagens = jogo.short_screenshots.map(img => img.image)

            const img1 = new EmbedBuilder()
                .setColor(jogo.dominant_color)
                .setImage(imagens[1])

            const img2 = new EmbedBuilder()
                .setColor(jogo.dominant_color)
                .setImage(imagens[2])

            const img3 = new EmbedBuilder()
                .setColor(jogo.dominant_color)
                .setImage(imagens[3])

            interaction.channel.send({ embeds: [img1, img2, img3], components: [row], ephemeral: true })
        }


    }

    if (interaction.isStringSelectMenu()) {
        const userId = interaction.user.id
        const select = interaction.values[0]

        switch (select) {
            case 'endscitys': return await interaction.reply({ embeds: [EndCitys], ephemeral: true })
                break;
            case 'nether': return await interaction.reply({ embeds: [Nether], ephemeral: true })
                break;
            case 'overworld': return await interaction.reply({ embeds: [OverWorld], ephemeral: true })
                break

            case 'java':
                embed.setColor('Green')
                embed.setDescription('Servidor Minecraft Java')
                embed.setFields(
                    { name: 'Servidor', value: 'valk.lura.pro' },
                    { name: 'Porta', value: '35606' }
                )

                return await interaction.reply({ embeds: [embed] })
                break

            case 'bedrock':
                embed.setColor('Green')
                embed.setDescription('Servidor Minecraft Bedrock')
                embed.setFields(
                    { name: 'Servidor', value: 'valk.lura.pro' },
                    { name: 'Porta', value: '35606' }
                )
                return await interaction.reply({ embeds: [embed] })
                break
        }



        switch (select) {
            case '0':
                alterarBanner(userId, select)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '1':
                alterarBanner(userId, select)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '2':
                alterarBanner(userId, select)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '3':
                alterarBanner(userId, select)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '4':
                alterarBanner(userId, select)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '5':
                alterarBanner(userId, select)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '6':
                alterarBanner(userId, select)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '7':
                alterarBanner(userId, select)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '8':
                alterarBanner(userId, select)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '9':
                alterarBanner(userId, select)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;

            case '10':
                alterarBanner(userId, select)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '11':
                alterarBanner(userId, select)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;

            case '12':
                alterarBanner(userId, select)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;

            case '13':
                alterarBanner(userId, select)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;

            default:
                embed.setDescription('Não foi possível Alterar o Banner')
                embed.setColor('Red')
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
        }

    } else return
}


/**
 * 
 * @param {String} nameGame 
 * @returns {Objeto} Informações do jogo pesquisado na API
 */
async function Buscarjogo(nameGame) {
    const url = `https://api.rawg.io/api/games`

    try {
        const response = await axios.get(url, {
            params: {
                key: RAWG_API,
                search: nameGame
            }
        })

        if (response.data && response.data.results.length > 0) {
            return response.data.results;
        } else {
            console.log('Nenhum jogo encontrado.');
            return [];
        }
    } catch (error) {
        console.error('Erro ao buscar o jogo:', error.message);
        return null;
    }
}

async function alterarBanner(userId, idBanner) {
    try {
        await axios.patch(`${URL_USUARIO}/${userId}`, {
            wallpaper: +idBanner
        })

    } catch (error) {
        console.log(error.message + error.response.data)
    }

}



/**
 * @returns  {Array} - Retorna um array de usuários já em ordem crescente 
 */
async function ranking() {
    const response = await axios.get(`${URL_USUARIO}`)

    const user = response.data
    user.sort((a, b) => {
        if (b.nivel === a.nivel) {
            return b.xp - a.xp
        }
        return b.nivel - a.nivel
    })
    return user
}


/**
 * 
 * @param {Inteiro} userId - id do usuário
 * @param {Inteiro} add - Quantidade de xp que será adicionada
 */

async function addXp(userId, add) {

    const response = await axios.get(`${URL_USUARIO}/${userId}`)

    const usuario = response.data
    const xp = usuario.xp + add

    await axios.patch(`${URL_USUARIO}/${userId}`, {
        xp: xp
    })
}

/**
 * 
 * @param {Inteiro} indice Numero inteiro responsável por selecionar o banner do usuário
 * @returns Retorna banner como objeto para ser usado
 */
async function Banner(indice) {

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
        { banner: 'https://images-ext-1.discordapp.net/external/VqkxJ18-8oJKiLMoLUyz46VNBRb1XtCQjrFbJiLfqfo/https/wallpapers.com/images/hd/calm-aesthetic-desktop-8t7o1e3i0gaoodqz.jpg?format=webp&width=1258&height=683', cor: '#1f84ff' },
        { banner: 'https://www.riotgames.com/darkroom/1440/056b96aab9c107bfb72c1cc818be712a:8e765b8b8b63d537b82096f248c2f169/tf-graves-pride-0.png', cor: '#f27900' },
        { banner: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgMl2_YrppPp5AgsNi9DHOjJkCFMDXPC55vQ&s', cor: '#6600ff' },
        { banner: 'https://m.media-amazon.com/images/S/pv-target-images/2e1f13308ead2fc251f71910b50e253af2f566d717f64dfcfd69a6ab5d8b00dd._SX1080_FMjpg_.jpg', cor: '#bf2126' },
    ]

    return banners[indice]
}


/**
 * 
 * 
 * @returns dia, mes, ano, horas, minutos
 */
function Hoje() {

    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();

    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');

    return { dia, mes, ano, horas, minutos }
}

/**
 * 
 * @param {Inteiro} level - Nivel atual do usuario
 * @returns {Inteiro} - Xp necessária para o próximo nivel
 */
function calculateXpForNextLevel(level) {
    return 100 * Math.pow(1.5, level - 1)
}

/**
 * 
 * @param {Inteiro} userId - id usuário
 * 
 */
async function addLVL(userId) {

    const response = await axios.get(`${URL_USUARIO}/${userId}`, {

    })
    const usuario = response.data

    const nivel = usuario.nivel
    const xp = usuario.xp

    const xpForNextLevel = await calculateXpForNextLevel(nivel);

    if (xp >= xpForNextLevel) {
        let newXp = xp - xpForNextLevel
        let newLvl = nivel.lvl + 1

        await axios.patch(`${URL_USUARIO}/${userId}`, {
                xp: newXp,
                nivel: newLvl
        })
    }

    return Math.round(xpForNextLevel)
}

module.exports = { controler, addXp, Hoje, addLVL, ranking, Banner, Buscarjogo }