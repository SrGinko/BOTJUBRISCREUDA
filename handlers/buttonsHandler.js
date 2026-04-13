const { ContainerBuilder, TextDisplayBuilder, MessageFlags, MediaGalleryBuilder, LabelBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SeparatorBuilder, SeparatorSpacingSize, ModalBuilder, ComponentType } = require('discord.js')
const { formatDate } = require('../Utils/date')
const { addXp } = require('../Utils/xp')
const { obterUnicoItem, obterItensInventario } = require('../Utils/itensInventario')
const { updateBattleMessage, rewardsAndEnd, getBattleById, getCurrentTurn, nextTurn, processTurn, performAttack } = require('../RPG/battleManager')
const rpgEvents = require('../Events/rpgEvents')
const banners = require('../data/banners')
const { BuscarjogoNome } = require('../Utils/buscarJogos')
const { api } = require('../Utils/axiosClient')

async function handleActionButton(customId, user, interaction) {
    const [prefix, action, userId, battleId] = customId.split(':')

    if (prefix === 'rpg') {

        const batalha = getBattleById(battleId)

        if (!batalha) return { ok: false, message: 'Nenhuma batalha ativa' }

        const IsPlayer = batalha.players.some(p => p.id === user.id)

        if (!IsPlayer) {
            return { ok: false, message: 'Você não faz parte dessa batalha' }
        }

        const current = getCurrentTurn(batalha)

        if (current.id !== user.id) return { ok: false, message: 'Não é seu turno !' }

        if (batalha.processing) return { ok: false, message: 'Ação em andamento aguarde' }

        batalha.processing = true

        try {
            if (action === 'attack') {

                await interaction.deferUpdate()

                const attacker = current

                const attackerResult = await performAttack(batalha, attacker)

                await updateBattleMessage(batalha, attackerResult.text)

                const result = require('../RPG/battleManager').checkBattleEnd?.(batalha)

                if (result) {
                    await rewardsAndEnd(batalha, result)
                    return { ok: true }
                }

                nextTurn(batalha)
                await processTurn(batalha)


            } else if (action === 'run') {
                const player = current

                let chance = 0.35

                const roll = Math.random()

                if (roll < chance) {
                    await updateBattleMessage(batalha, `${player.nome} fugiu!`)
                    await rewardsAndEnd(batalha, 'fuga')
                } else {
                    await updateBattleMessage(batalha, `${player.nome} tentou fugir e falhou!`)

                    nextTurn(batalha)
                    await processTurn(batalha)
                }
            } else if (action === 'heal') {

                const inventario = await obterItensInventario(current.id)
                const itensCuraveis = inventario.map(itens => {
                    return {
                        itens: itens.item,
                        quantidade: itens.quantidade
                    }
                }).filter(item => item.itens.tipo === 'CONSUMIVEL' && item.itens.heal > 0)

                if (itensCuraveis.length > 0) {
                    const modal = new ModalBuilder({
                        title: 'Usar Consumível',
                        customId: `rpg:curar:${current.id}:${battleId}`,
                    })
                        .addTextDisplayComponents(
                            new TextDisplayBuilder({
                                content: 'Selecione o consumível que deseja usar:',
                            })
                        )
                        .addLabelComponents(
                            new LabelBuilder({
                                label: 'Consumível:',
                                description: 'Selecione o consumível que deseja usar',
                                component: {
                                    type: ComponentType.StringSelect,
                                    custom_id: 'consumivelSelect',
                                    required: true,
                                    max_values: itensCuraveis.length,
                                    min_values: 1,
                                    options: itensCuraveis.map(item => ({
                                        label: `${item.itens.nome}`,
                                        description: `Cura ${item.itens.heal}% da Vida | Quantidade: ${item.quantidade}`,
                                        value: String(item.itens.id)
                                    }))
                                }
                            })
                        )

                    await interaction.showModal(modal)

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

            container.addActionRowComponents(
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setEmoji(`<:controle:1463846749285257260>`)
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
                        {
                            media:
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
**Metatric:** ${jogo.metacritic || 'N/A'}
**Avaliação:** ${jogo.rating} / ${jogo.rating_top}
**Plataformas:** ${jogo.platforms.map(element => { return element.platform.name }).join(', ')}
**Data de Lançamento:** ${formatDate(jogo.released)}
**Gêneros:** ${jogo.genres.map(element => { return element.name }).join(', ')}
`
                })
            )

            container.addActionRowComponents(
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setEmoji(`<:foto:1463846754322747497>`).setStyle(ButtonStyle.Secondary).setCustomId(`games:imagens:${userId}`),
                    new ButtonBuilder().setEmoji('➕').setLabel('Adicionar Sugestão').setStyle(ButtonStyle.Secondary).setCustomId(`games:suggest:${userId}`)
                )
            )

            await interaction.update({ flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral], components: [container] })
            return { ok: true }
        } else if (action === 'suggest') {

            const forumChannel = await interaction.client.channels.fetch('1428656735505223720')
            const response = await BuscarjogoNome(userId)
            const jogo = response[0]

            const container = new ContainerBuilder()

            container.addMediaGalleryComponents(
                new MediaGalleryBuilder({
                    items: [
                        {
                            media:
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

            const listaTags = jogo.genres.map(g => g.name)

            const existentes = forumChannel.availableTags ?? []
            const nomesExistentes = existentes.map(tag => tag.name.toLowerCase())

            console.log(listaTags)

            const tagsFinal = []

            for (const t of existentes) {
                tagsFinal.push({
                    id: t.id,
                    name: t.name,
                    emoji: t.emoji ?? undefined
                })
            }

            for (const tag of listaTags) {
                if (!nomesExistentes.includes(tag.toLowerCase())) {
                    tagsFinal.push({
                        name: tag,
                        emoji: undefined
                    })
                }
            }

            await forumChannel.setAvailableTags(tagsFinal)
            const forumAtualizado = await interaction.client.channels.fetch(forumChannel.id)
            const appliedTags = []

            for (const desiredTag of listaTags) {
                const encontrado = forumAtualizado.availableTags.find(t => t.name.toLowerCase() === desiredTag.toLowerCase())
                if (encontrado) {
                    appliedTags.push(encontrado.id)
                }
            }

            const post = await forumAtualizado.threads.create({
                name: jogo.name,
                message: {
                    flags: [MessageFlags.IsComponentsV2],
                    components: [container],
                },
                appliedTags: appliedTags
            })

            addXp(user.id, 50)
            await interaction.deferUpdate()
        }
    } if (prefix === 'loja') {
        if (action === 'comprar') {
            const itemID = parseInt(interaction.customId.split(':')[2])

            const item = await obterUnicoItem(itemID)

            const modal = new ModalBuilder({
                title: 'Comprar Item',
                customId: `rpg:confirmarcompra:${itemID}:${user.id}`,
            })
                .addTextDisplayComponents(
                    new TextDisplayBuilder({
                        content: 'Você está prestes a comprar esse item, selecione a quantidade e clica no botão abaixo para confirmar.',
                    })
                )
                .addLabelComponents(
                    new LabelBuilder({
                        label: 'Quantidade:',
                        description: `Quantas unidades de ${item.nome} você deseja comprar?`,
                        component: {
                            type: ComponentType.TextInput,
                            custom_id: 'quantidade',
                            style: 1,
                            required: true,
                            min_length: 1,
                            max_length: 2,
                            placeholder: 'Digite a quantidade',
                            value: '1'
                        }
                    }))
            await interaction.showModal(modal)
        }
    }
    if (prefix === 'system') {
        if (action === 'alterar_banner') {
            const modal = new ModalBuilder({
                title: 'Alterar Banner',
                customId: `system:alterarBanner:${userId}`,
            })
                .addLabelComponents(
                    new LabelBuilder({
                        label: 'Banner:',
                        description: 'Selecione o banner que deseja usar',
                        component: {
                            type: ComponentType.StringSelect,
                            custom_id: "banner",
                            options: banners.map(banner => ({
                                label: banner.name,
                                value: banner.id
                            }))
                        }
                    })
                )

            await interaction.showModal(modal)

        } if (action === 'verheroi') {

            await interaction.deferUpdate()

            const wallpaperIndex =
                await api.get(`/usuario/${userId}`)
                    .then(res => res.data.wallpaper)
                    .catch(err => {
                        console.error(err)
                        return 0
                    })

            const { conteiner, attachment } =
                await require('../Utils/utilsPerfil')
                    .creatPerfil(userId, wallpaperIndex, interaction, 'heroi')

            await interaction.editReply({
                files: [attachment],
                components: [conteiner],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            })
        } if (action === 'verusuario') {
            await interaction.deferUpdate()

            const wallpaperIndex =
                await api.get(`/usuario/${userId}`)
                    .then(res => res.data.wallpaper)
                    .catch(err => {
                        console.error(err)
                        return 0
                    })

            const { conteiner, attachment } =
                await require('../Utils/utilsPerfil')
                    .creatPerfil(userId, wallpaperIndex, interaction, 'usuario')

            await interaction.editReply({
                files: [attachment],
                components: [conteiner],
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
            })
        }
    }
    return { ok: true }
}

module.exports = { handleActionButton }