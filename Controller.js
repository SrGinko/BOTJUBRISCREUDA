const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require('discord.js')
const db = require('./db')
const dotenv = require('dotenv')
dotenv.config()
const { RAWG_API } = process.env
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

            interaction.channel.send({ embeds: [img1, img2, img3], components: [row], ephemeral:true})
        }


    }

    if (interaction.isStringSelectMenu()) {
        const userId = interaction.user.id

        const updateFundo = db.prepare(`UPDATE users SET fundo = ? WHERE id = ?`)

        const select = interaction.values[0]

        switch (select) {
            case 'endscitys': return await interaction.reply({ embeds: [EndCitys], ephemeral: true })
                break;
            case 'nether': return await interaction.reply({ embeds: [Nether], ephemeral: true })
                break;
            case 'overworld': return await interaction.reply({ embeds: [OverWorld], ephemeral: true })
        }



        switch (select) {
            case '0':
                updateFundo.run(select, userId)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '1':
                updateFundo.run(select, userId)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '2':
                updateFundo.run(select, userId)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '3':
                updateFundo.run(select, userId)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '4':
                updateFundo.run(select, userId)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '5':
                updateFundo.run(select, userId)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '6':
                updateFundo.run(select, userId)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '7':
                updateFundo.run(select, userId)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '8':
                updateFundo.run(select, userId)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;
            case '9':
                updateFundo.run(select, userId)
                embed.setDescription('Banner Alterado com sucesso')
                embed.setColor('Green')
                addXp(userId, 5)
                return await interaction.reply({ embeds: [embed], ephemeral: true })
                break;

            case '10':
                updateFundo.run(select, userId)
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



/**
 * 
 * @param {Array} user - Array de usuários para realizar a comparação 
 * @returns  {Array} - Retorna um array de usuários já em ordem crescente 
 */
async function ranking(user) {
    user.sort((a, b) => {
        if (b.lvl === a.lvl) {
            return b.xp - a.xp
        }
        return b.lvl - a.lvl
    })

    return user
}


/**
 * 
 * @param {Inteiro} userId - id do usuário
 * @param {Inteiro} add - Quantidade de xp que será adicionada
 */

async function addXp(userId, add) {
    const selectXp = db.prepare(`SELECT xp from users WHERE id = ?`)
    const updateXp = db.prepare(`UPDATE users SET xp = ? WHERE id = ?`)

    const xp = selectXp.get(userId)
    var newXp = xp.xp + add

    await updateXp.run(newXp, userId)
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
        { banner: 'https://images-ext-1.discordapp.net/external/VqkxJ18-8oJKiLMoLUyz46VNBRb1XtCQjrFbJiLfqfo/https/wallpapers.com/images/hd/calm-aesthetic-desktop-8t7o1e3i0gaoodqz.jpg?format=webp&width=1258&height=683', cor: '#2172a1' },
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
 * @param {Inteiro} userId id usuário
 * 
 */
async function addLVL(userId) {

    const selectXp = db.prepare(`SELECT xp from users WHERE id = ?`)
    const selectLvl = db.prepare(`SELECT lvl from users WHERE id = ?`)
    const updateLvl = db.prepare(`UPDATE users SET lvl = ? WHERE id = ?`)
    const updatexp = db.prepare(`UPDATE users SET xp = ? WHERE id = ?`)

    var experiencia = selectXp.get(userId)
    var nivel = selectLvl.get(userId)

    switch (nivel.lvl) {
        case 1:
            if (experiencia.xp >= 100) {
                let newXp = experiencia.xp - 100
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 100
            break;
        case 2:
            if (experiencia.xp >= 500) {
                let newXp = - experiencia.xp - 500
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)

            }
            return 500
            break;
        case 3:
            if (experiencia.xp >= 1000) {
                let newXp = experiencia.xp - 1000
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 1000
            break;
        case 4:
            if (experiencia.xp >= 1500) {
                let newXp = experiencia.xp - 1500
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 1500
            break;
        case 5:
            if (experiencia.xp >= 2000) {
                let newXp = experiencia.xp - 2000
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 2000
            break;
        case 6:
            if (experiencia.xp >= 3000) {
                let newXp = experiencia.xp - 3000
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 3000
            break;
        case 7:
            if (experiencia.xp >= 4000) {
                let newXp = experiencia.xp - 4000
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 4000
            break;
        case 8:
            if (experiencia.xp >= 6000) {
                let newXp = experiencia.xp - 6000
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 6000
            break;
        case 9:
            if (experiencia.xp >= 8000) {
                let newXp = experiencia.xp - 8000
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 8000
            break;
        case 10:
            if (experiencia.xp >= 10000) {
                let newXp = experiencia.xp - 10000
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 10000
            break;
        case 11:
            if (experiencia.xp >= 12000) {
                let newXp = experiencia.xp - 12000
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 12000
            break;
        case 12:
            if (experiencia.xp >= 16000) {
                let newXp = experiencia.xp - 16000
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 16000
            break;
        case 13:
            if (experiencia.xp >= 22000) {
                let newXp = experiencia.xp - 22000
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 22000
            break;
        case 14:
            if (experiencia.xp >= 26000) {
                let newXp = experiencia.xp - 26000
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 26000
            break;

        default:
            break;
    }
}

module.exports = { controler, addXp, Hoje, addLVL, ranking, Banner, Buscarjogo }