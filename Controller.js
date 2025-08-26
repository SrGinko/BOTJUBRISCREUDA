const { EmbedBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags, MediaGalleryBuilder, SectionBuilder, ThumbnailBuilder, hyperlink } = require('discord.js')
const { RAWG_API } = process.env
const axios = require('axios')
const api = require('./Utils/axiosClient')
const { formatDate } = require('./Utils/date')
const { addXp } = require('./Utils/xp')
const hydraLinks = require('./data/hydraLinks')
const { getRandonCores } = require('./Utils/cores')

const embed = new EmbedBuilder()

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
                    await api.patch(`/${userId}`, {
                        wallpaper: +alterarBanner
                    })

                } catch (error) {
                    console.log(error.message + error.response.data)
                }

                const banners = require('./data/banners')

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
    const response = await api.get(`/usuario`)

    const user = response.data
    user.sort((a, b) => {
        if (b.nivel === a.nivel) {
            return b.xp - a.xp
        }
        return b.nivel - a.nivel
    })
    return user
}

module.exports = { controler, ranking, Buscarjogo }