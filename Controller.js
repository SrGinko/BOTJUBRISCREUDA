const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ContainerBuilder, TextDisplayBuilder, MessageFlags, MediaGalleryBuilder, SeparatorBuilder, SectionBuilder, ThumbnailBuilder, hyperlink } = require('discord.js')
const dotenv = require('dotenv')
dotenv.config()
const { RAWG_API, URL_USUARIO } = process.env
const axios = require('axios')
const { getRandonCores } = require('./Utils/cores')

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
 * @param {Objeto} interaction - Necessaria para execução dos comandos
 * @returns {Objeto} - Retorna valor da interação
 */

async function controler(interaction) {

    if (interaction.isStringSelectMenu()) {
        const userId = interaction.user.id
        const idMenu = interaction.customId

        switch (idMenu) {
            case 'game': {

                const game = interaction.values[0]
                const response = await Buscarjogo(game)
                const jogo = response[0]

                try {
                    const cor = getRandonCores()

                    const container = new ContainerBuilder({
                        accent_color: cor,
                    })

                    container.addSectionComponents(
                        new SectionBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder({
                                    content: `# ${jogo.name}
**Metatric:** ${jogo.metacritic}
**Plataformas:** ${jogo.platforms.map(element => { return element.platform.name }).join(', ')}
**Data de Lançamento:** ${formatDate(jogo.released)}
**Gêneros:** ${jogo.genres.map(element => { return element.name }).join(', ')}
`
                                })
                            )
                            .setThumbnailAccessory(
                                new ThumbnailBuilder({ media: { url: jogo.background_image } })
                            )
                    )

                    container.addMediaGalleryComponents({
                        items: jogo.short_screenshots.map(element => {
                            return { media: { url: element.image } }
                        })
                    })

                    addXp(userId, 30)
                    await interaction.update({ flags: [MessageFlags.IsComponentsV2], components: [container] })

                } catch (error) {
                    console.log(error)
                }


            } break;

            case 'coordenadas': {
                const coordenadas = interaction.values[0]

                switch (coordenadas) {
                    case 'endscitys': return await interaction.reply({ embeds: [EndCitys], ephemeral: true })
                        break;
                    case 'nether': return await interaction.reply({ embeds: [Nether], ephemeral: true })
                        break;
                    case 'overworld': return await interaction.reply({ embeds: [OverWorld], ephemeral: true })
                        break

                }
            } break;
            case 'server': {
                const server = interaction.values[0]

                switch (server) {
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

            } break

            case 'alterbanner': {
                const alterarBanner = interaction.values[0]

                try {
                    await axios.patch(`${URL_USUARIO}/${userId}`, {
                        wallpaper: +alterarBanner
                    })

                } catch (error) {
                    console.log(error.message + error.response.data)
                }

                const banners = await Banner()

                const conteiner = new ContainerBuilder({
                    accent_color: 0x00f521,
                    timestamp: true,
                    components: [
                        new TextDisplayBuilder({
                            content: `# Banner alterado com sucesso!\n Esse é o novo banner:`,
                            style: 'Short',
                        }),
                        new MediaGalleryBuilder({
                            items: [
                                {
                                    media: {
                                        type: 'Image',
                                        url: banners[+alterarBanner].banner
                                    }
                                }
                            ]
                        })
                    ]
                })

                return await interaction.reply({ flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral], components: [conteiner] })
            }

            case 'hydra': {
                const id = interaction.values
                let item

                if (id.includes('todos')) {
                    item = hydraLinks.slice(1)
                } else {
                    item = hydraLinks.filter(item => id.includes(item.id))
                }


                if (item.length > 0) {
                    const container = new ContainerBuilder({
                        accent_color: getRandonCores()
                    })

                    container.addSectionComponents(
                        new SectionBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder({
                                    content: `# HydraLauncher
- Link de Download da HydraLauncher ${hyperlink('Clique aqui', 'https://github.com/hydralauncher/hydra/releases/')}
- Tutorial de como Instalar ${hyperlink('Clique aqui', 'https://youtu.be/Yo9fka6A6RE?si=zSjO1txthuQsFcjU')}
`
                                })
                            )
                            .setThumbnailAccessory(
                                new ThumbnailBuilder({
                                    media: { url: 'https://github.com/hydralauncher/hydra/raw/main/resources/icon.png' }
                                })
                            )
                    )

                    container.addSeparatorComponents()

                    item.forEach(element => {
                        container.addTextDisplayComponents(
                            new TextDisplayBuilder({
                                content: `**${element.name}:** \`\`\`${element.link}\`\`\``
                            })
                        )
                    })

                    await interaction.update({ flags: [MessageFlags.IsComponentsV2], components: [container] })

                } else {
                    await interaction.update({ content: 'Nenhum jogo encontrado.', flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })
                }
            }
        }
    } else return
}


function formatDate(date) {
    const parter = date.split('-')
    return dataFormatada = `${parter[2]}/${parter[1]}/${parter[0]}`
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
            return response.data.results
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
 * @returns  {Array} - Retorna um array de usuários já em ordem crescente 
 */
async function ranking() {
    const response = await axios.get(`${URL_USUARIO}`, {
        headers: {
            apikey: API_MONTEIR_KEY
        },
    })

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
 * @param {Inteiro} add - Quantidade de mensagem que será adicionada
 */
async function addMenssage(userId, add) {
    const response = await axios.get(`${URL_USUARIO}/${userId}`, {
        headers: {
            apikey: API_MONTEIR_KEY
        }
    })

    const usuario = response.data
    const msg = usuario.quantidadeMensagens + add
    await axios.patch(`${URL_USUARIO}/${userId}`, {
        quantidadeMensagens: msg
    }, {
        headers: {
            apikey: API_MONTEIR_KEY
        }
    })

    return msg
}



/**
 * 
 * @param {Inteiro} userId - id do usuário
 * @param {Inteiro} add - Quantidade de xp que será adicionada
 */

async function addXp(userId, add) {

    const date = new Date()
    const diaSemana = date.getDay()

    if (diaSemana === 0 || diaSemana === 6) {
        add = add * 2
    }

    const response = await axios.get(`${URL_USUARIO}/${userId}`, {
        headers: {
            apikey: API_MONTEIR_KEY
        }
    })

    const usuario = response.data
    const xp = usuario.xp + add
    await axios.patch(`${URL_USUARIO}/${userId}`, {
        xp: xp
    }, {
        headers: {
            apikey: API_MONTEIR_KEY
        }
    })

}

const hydraLinks = [
    { id: 'todos', name: 'Todos', link: '' },
    { id: 'rutracker', name: 'Rutracker', link: 'https://raw.githubusercontent.com/KekitU/rutracker-hydra-links/main/all_categories.json' },
    { id: 'onlinefix', name: 'Onlinefix', link: 'https://hydralinks.cloud/sources/onlinefix.json' },
    { id: 'gog', name: 'GOG', link: 'https://hydralinks.cloud/sources/gog.json' },
    { id: 'fitgril', name: 'FitGril', link: 'https://hydralinks.cloud/sources/fitgirl.json' },
    { id: 'dodi', name: 'Dodi', link: 'https://hydralinks.cloud/sources/dodi.json' },
    { id: 'steamrip', name: 'SteamRip', link: 'https://hydralinks.cloud/sources/steamrip.json' },
    { id: 'steamrip-apps', name: 'SteamRip[Apps]', link: 'https://hydralinks.cloud/sources/steamrip-software.json' },
    { id: 'atop', name: 'Atop', link: 'https://hydralinks.cloud/sources/atop-games.json' },
    { id: 'shisuys-source', name: 'Shisuy`s Source', link: 'https://raw.githubusercontent.com/Shisuiicaro/source/refs/heads/main/shisuyssource.json' },
    { id: 'repack-games', name: 'Repack-Games', link: 'https://hydralinks.cloud/sources/repack-games.json' },
    { id: 'byxatab', name: 'ByXatab', link: 'https://hydralinks.pages.dev/sources/xatab.json' },
    { id: 'empress', name: 'Empress', link: 'https://hydralinks.pages.dev/sources/empress.json' },
]

/**
 * 
 * @param {Inteiro} indice Numero inteiro responsável por selecionar o banner do usuário
 * @returns Retorna banner como objeto para ser usado
 */
async function Banner() {

    const banners = [
        { name: 'Wave', id: '0', banner: 'https://marketplace.canva.com/EAF_ZFGfAwE/1/0/1600w/canva-banner-para-twitch-montanha-vintage-retr%C3%B4-roxo-nqw7QjAVpKo.jpg', cor: '#be81d5', corHEX: 0xbe81d5 },
        { name: 'Tarde', id: '1', banner: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtgFyujRcuyq3gu7zLoQp7rg3YMWHTN4qSrQ&s', cor: '#f74922', corHEX: 0xf74922 },
        { name: 'Hacker', id: '2', banner: 'https://wallpapers.com/images/featured/4k-minimalista-2dpumtq7d6vnq2fv.jpg', cor: '#ffffff', corHEX: 0xffffff },
        { name: 'Montanhas', id: '3', banner: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTouyrbJzJZPnrtdcvmjrPmH3hClu7EuJZuJqB0MPJqCWrmCtfJYtQ5cE-rxs76GTaEOxM&usqp=CAU', cor: '#0398ce', corHEX: 0x0398ce },
        { name: 'Floresta', id: '4', banner: 'https://img.freepik.com/fotos-premium/imagens-de-papel-de-parede-em-4k_655257-1108.jpg', cor: '#6628f6', corHEX: 0x6628f6 },
        { name: 'Astronalta', id: '5', banner: 'https://res.cloudinary.com/dte7upwcr/image/upload/v1677788739/blog/blog2/ia-criar-imagens/ia-criar-imagens2.jpg', cor: '#01e4ca', corHEX: 0x01e4ca },
        { name: 'Folha', id: '6', banner: 'https://img.freepik.com/fotos-gratis/beleza-abstrata-de-outono-em-padrao-multicolorido-de-veios-de-folhas-gerado-por-ia_188544-9871.jpg', cor: '#a20104', corHEX: 0xa20104 },
        { name: 'Samael', id: '7', banner: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d6d9158f-1b03-4024-9f88-9d599c4c968a/df29tev-80fc62a5-5763-45a3-8b61-ec7f6d703924.png/v1/fit/w_600,h_240,q_70,strp/discord_banner__2__watermarked__by_gothymoth_df29tev-375w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjQwIiwicGF0aCI6IlwvZlwvZDZkOTE1OGYtMWIwMy00MDI0LTlmODgtOWQ1OTljNGM5NjhhXC9kZjI5dGV2LTgwZmM2MmE1LTU3NjMtNDVhMy04YjYxLWVjN2Y2ZDcwMzkyNC5wbmciLCJ3aWR0aCI6Ijw9NjAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.PWzYbhsRZ8zU0Xn4y16vSFFyHg4SgbHE4pEw_O7_-LQ', cor: '#741111', corHEX: 0x741111 },
        { name: 'Vaquinha', id: '8', banner: 'https://i.pinimg.com/1200x/ad/17/d5/ad17d516ba4254ead5cb9bd2747dcc53.jpg', cor: '#9600db', corHEX: 0x9600db },
        { name: 'Onda', id: '9', banner: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIs0-MKricZIAODzC4Ki4ePIsKsQhxCksQjA&s', cor: '#ffffff', corHEX: 0xffffff },
        { name: 'Neblina', id: '10', banner: 'https://images-ext-1.discordapp.net/external/VqkxJ18-8oJKiLMoLUyz46VNBRb1XtCQjrFbJiLfqfo/https/wallpapers.com/images/hd/calm-aesthetic-desktop-8t7o1e3i0gaoodqz.jpg?format=webp&width=1258&height=683', cor: '#1f84ff', corHEX: 0x1f84ff },
        { name: 'LOL', id: '11', banner: 'https://www.riotgames.com/darkroom/1440/056b96aab9c107bfb72c1cc818be712a:8e765b8b8b63d537b82096f248c2f169/tf-graves-pride-0.png', cor: '#f27900', corHEX: 0xf27900 },
        { name: 'Skull Sea Of Thieves', id: '12', banner: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgMl2_YrppPp5AgsNi9DHOjJkCFMDXPC55vQ&s', cor: '#6600ff', corHEX: 0x6600ff },
        { name: 'Hajime no Ippo', id: '13', banner: 'https://m.media-amazon.com/images/S/pv-target-images/2e1f13308ead2fc251f71910b50e253af2f566d717f64dfcfd69a6ab5d8b00dd._SX1080_FMjpg_.jpg', cor: '#bf2126', corHEX: 0xbf2126 },
        { name: 'Univers', id: '14', banner: 'https://images4.alphacoders.com/106/106826.jpg', cor: '#148ab3', corHEX: 0x148ab3 },
    ]

    return banners
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
        headers: {
            apikey: API_MONTEIR_KEY
        }

    })
    const usuario = response.data

    const nivel = usuario.nivel
    const xp = usuario.xp

    const xpForNextLevel = await calculateXpForNextLevel(nivel);

    if (xp >= xpForNextLevel) {
        let newXp = xp - xpForNextLevel
        let newLvl = nivel + 1

        await axios.patch(`${URL_USUARIO}/${userId}`, {
            xp: newXp,
            nivel: newLvl
        }, {
            headers: {
                apikey: API_MONTEIR_KEY
            }
        })
    }

    return Math.round(xpForNextLevel)
}

module.exports = { controler, addXp, Hoje, addLVL, ranking, Banner, Buscarjogo, addMenssage, hydraLinks }