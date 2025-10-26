const { EmbedBuilder, ContainerBuilder, TextDisplayBuilder, MessageFlags, MediaGalleryBuilder, SectionBuilder, ThumbnailBuilder, hyperlink, ActionRowBuilder, ButtonBuilder, ButtonStyle, SeparatorBuilder, SeparatorSpacingSize, StringSelectMenuBuilder } = require('discord.js')
const { RAWG_API } = process.env
const { api } = require('./Utils/axiosClient')
const { formatDate } = require('./Utils/date')
const { addXp } = require('./Utils/xp')
const { getRandonCores } = require('./Utils/cores')
const { obterUnicoItem, obterItensInventario } = require('./Utils/itensInventario')
const axios = require('axios')
const hydraLinks = require('./data/hydraLinks')
const { icone } = require('./Utils/emojis')
const { criarEmbed } = require('./Utils/embedFactory')
const { enemyTurn, updateBattleMessage, rewardsAndEnd, getBattle } = require('./RPG/battleManager')
const rpgEvents = require('./Events/rpgEvents')

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

                const gameName = interaction.values[0]
                const response = await BuscarjogoNome(gameName)
                const jogo = response[0]

                const container = new ContainerBuilder()

                container.addMediaGalleryComponents(
                    new MediaGalleryBuilder({
                        items: [
                            { media: { url: jogo.background_image } }
                        ]
                    })
                )

                container.addSeparatorComponents(
                    new SeparatorBuilder({
                        spacing: SeparatorSpacingSize.Large,
                        divider: false
                    })
                )

                container.addTextDisplayComponents(
                    new TextDisplayBuilder({
                        content: `# ${jogo.name}
**Metatric:** ${jogo.metacritic}
**Avaliação:** ${jogo.rating} / ${jogo.rating_top}
**Plataformas:** ${jogo.platforms.map(element => { return element.platform.name }).join(', ')}
**Data de Lançamento:** ${formatDate(jogo.released)}
**Gêneros:** ${jogo.genres.map(element => { return element.name }).join(', ')}
`
                    })
                )

                const imagensIcon = await icone(interaction.guild, 'fotos')

                container.addActionRowComponents(
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setEmoji(`${imagensIcon}`).setStyle(ButtonStyle.Secondary).setCustomId(`games:imagens:${gameName}`),
                    )
                )

                addXp(userId, 30)
                await interaction.update({ flags: [MessageFlags.IsComponentsV2], components: [container] })

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
                    await api.patch(`/usuario/${userId}`, {
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

                break;

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
                        accent_color: 0xffffff
                    })

                    container.addSectionComponents(
                        new SectionBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder({
                                    content: `# ${await icone(interaction.guild, 'download')}  HydraLauncher
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
                break;

            case 'equipar-item': {
                const itemId = interaction.values
                itemId.map(async id => {
                    let itens = await obterUnicoItem(+id)

                    switch (itens.tipo) {
                        case 'ARMA':
                            console.log(itens.id)
                            api.patch(`heroes/${userId}`, {
                                armaID: itens.id
                            })

                            const container = new ContainerBuilder({
                                accent_color: 0x00ff2a,
                                components: [
                                    new TextDisplayBuilder({
                                        content: 'Arma equipada com sucesso.'
                                    })
                                ]
                            })

                            api.patch(`heroes/${userId}/inventario/remover`, {
                                itemID: itens.id,
                                quantidade: 1
                            })

                            interaction.update({ components: [container] })
                            break
                        case 'ARMADURA':
                            api.patch(`heroes/${userId}`, {
                                armaduraID: itens.id
                            })
                            interaction.update({ content: 'Armadura equipada com sucesso.' })
                            break
                        case 'CALCA':
                            api.patch(`heroes/${userId}`, {
                                calcaID: itens.id
                            })
                            interaction.update({ content: 'Calca equipada com sucesso.' })
                            break
                        default:
                            interaction.update({ content: 'Item não equipável.' })
                            break
                    }
                })
            }

                break;
        }
    } else return
}

/**
 * 
 * @param {String} nameGame 
 * @returns {Objeto} Informações do jogo pesquisado na API
 */
async function BuscarjogoNome(nameGame) {
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

function chance(percent) {
    return Math.random() < percent / 100;
}

async function handleAction(customId, user, interaction) {
    const [prefix, action, userId] = customId.split(':')

    if (prefix === 'rpg') {

        const batalha = getBattle(userId)

        if (!batalha) return { ok: false, message: 'Nenhuma batalha ativa' }
        if (user.id !== userId) return { ok: false, message: 'Somente quem iniciou pode utilizar a ação' }

        if (batalha.processing) return { ok: false, message: 'Ação em andamento aguarde' }

        batalha.processing = true

        try {
            if (action === 'attack') {
                const damage = Math.max(0, Math.floor(batalha.player.attack - batalha.inimmigo.defesa + Math.random() * 5))
                batalha.inimmigo.hp = Math.max(0, batalha.inimmigo.hp - damage)

                rpgEvents.emit('playerAttack', { batalha, damage })

                await updateBattleMessage(batalha, `${batalha.player.nome} atacou e causou ${damage} de dano!`)

                if (batalha.inimmigo.hp <= 0) {


                    await rewardsAndEnd(batalha, 'vitoria')
                    return { ok: true }
                }

                await enemyTurn(batalha)

            } else if (action === 'run') {
                let chance = 0.35 + (batalha.player.nivel - batalha.inimmigo.level) * 0.02
                chance = Math.max(0.1, Math.min(0.9, chance))

                const roll = Math.random()

                if (roll < chance) {
                    await updateBattleMessage(batalha, `${batalha.player.nome} conseguiu fugir!`)
                    await rewardsAndEnd(batalha, 'fuga')
                } else {
                    await updateBattleMessage(batalha, `${batalha.player.nome} tentou fugir e falhou!`)
                    await enemyTurn(batalha)
                }
            } else if (action === 'heal') {

                const inventario = await obterItensInventario(batalha.player.id)
                const itensCuraveis = inventario.filter(itens => {
                    if (itens.tipo === 'CONSUMIVEL')
                        return itens
                })

                if (itensCuraveis.length > 0) {
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId(`rpg:userPotion:${batalha.player.id}`)
                                .setPlaceholder('Ecolha a poção para curar')
                                .addOptions(itensCuraveis.map(item => ({
                                    label: `${item.nome} (+${item.heal})`,
                                    value: String(item.id),
                                })))
                        )

                    await batalha.channel.send({
                        embeds: [criarEmbed({
                            title: 'Poções',
                            description: 'Selecione uma poção para poder se curar',
                            color: 'Green',
                            footer: 'Jubscreuda RPG'
                        })], components: [row]
                    })

                    batalha.processing = false
                    return { ok: true }
                }
                batalha.processing = false
                return { ok: false, message: 'Você não tem consumiveis' }
            }
        } catch (erro) {
            console.log(erro)
        } finally {
            batalha.processing = false
        }
    } else if (prefix === 'games') {
        if (action === 'imagens') {
            const response = await BuscarjogoNome(userId)
            const game = response[0]
            

            const container = new ContainerBuilder()

            container.addMediaGalleryComponents(
                new MediaGalleryBuilder({
                    items: game.short_screenshots.map(screenshot => ({ media: { url: screenshot.image } }))
                })
            )

            const controlerIcon = await icone(interaction.guild, 'controle')

            container.addActionRowComponents(
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setEmoji(`${controlerIcon}`)
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(`games:info:${userId}`),
                )
            )

            await interaction.update({ components: [container], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })
            return { ok: true }

        } else if (action === 'info') {
            const response = await BuscarjogoNome(userId)
            const jogo = response[0]

            const container = new ContainerBuilder()

            container.addMediaGalleryComponents(
                new MediaGalleryBuilder({
                    items: [
                        { media: 
                            { url: jogo.background_image },
                        }
                    ]
                })
            )

            container.addSeparatorComponents(
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large,
                    divider: false
                })
            )

            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `# ${jogo.name}
**Metatric:** ${jogo.metacritic}
**Avaliação:** ${jogo.rating} / ${jogo.rating_top}
**Plataformas:** ${jogo.platforms.map(element => { return element.platform.name }).join(', ')}
**Data de Lançamento:** ${formatDate(jogo.released)}
**Gêneros:** ${jogo.genres.map(element => { return element.name }).join(', ')}
`
                })
            )

            const imagensIcon = await icone(interaction.guild, 'fotos')

            container.addActionRowComponents(
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setEmoji(`${imagensIcon}`).setStyle(ButtonStyle.Secondary).setCustomId(`games:imagens:${userId}`),
                )
            )

            await interaction.update({ flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral], components: [container] })
            return { ok: true }
        }
    }
    return { ok: true }
}


module.exports = { controler, ranking, chance, handleAction, BuscarjogoNome }