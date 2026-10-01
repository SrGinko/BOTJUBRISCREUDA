const { ContainerBuilder, TextDisplayBuilder, MessageFlags, SeparatorBuilder, SeparatorSpacingSize } = require('discord.js')
const { criarEmbed } = require('../Utils/embedFactory')
const { api } = require('../Utils/axiosClient')
const { addItem, removeItem, equiparItem, obterUnicoItem } = require('../Utils/itensInventario')
const { updateBattleMessage, rewardsAndEnd, getBattleById, getCurrentTurn, nextTurn, processTurn } = require('../RPG/battleManager')
const { tryApplyStatusEffect } = require('../RPG/engine')

async function ModalHandleAction(interaction) {
    const [prefix, action, id, battleId] = interaction.customId.split(':')

    if (prefix === 'tv') {
        switch (action) {
            case 'addcanal': {
                const nomeCanal = interaction.fields.getTextInputValue('canalNome')
                const canalUrl = interaction.fields.getTextInputValue('canalUrl')
                const capaCanal = interaction.fields.getTextInputValue('capaUrl')

                api.post('/tv/canais', {
                    nome: nomeCanal,
                    url: canalUrl,
                    capaUrl: capaCanal
                })

                interaction.reply({
                    embeds: [
                        criarEmbed({
                            description: 'Encaminhado dados !',
                            color: 'Green'
                        })
                    ],
                    flags: 64
                })

                const channel = await interaction.guild.channels.fetch('1428656070552850483')
                guildEvent.emit('addcanal', { nomeCanal, CapaCanal: capaCanal, channel })
                break
            }
            default:
                break
        }
    } else if (prefix === 'rpg') {
        switch (action) {
            case 'curar': {
                const selecionados = interaction.fields.getStringSelectValues('consumivelSelect')

                const itensUsados = await Promise.all(
                    selecionados.map(async (itemId) => obterUnicoItem(Number(itemId)))
                )

                const batalha = getBattleById(battleId)
                if (!batalha) return

                const current = getCurrentTurn(batalha)
                const participanteValido = [...batalha.players, ...batalha.enemies]
                    .some(personagem => personagem.id === interaction.user.id && personagem.isHuman)

                if (!participanteValido) {
                    return interaction.reply({
                        content: 'Voce nao faz parte dessa batalha.',
                        ephemeral: true
                    })
                }

                if (current.id !== interaction.user.id) {
                    return interaction.reply({
                        content: 'Nao e seu turno!',
                        ephemeral: true
                    })
                }

                const curaTotal = itensUsados.reduce((total, item) => {
                    const porcentagem = item.heal || 0
                    const cura = Math.floor((current.maxHp * porcentagem) / 100)
                    return total + cura
                }, 0)

                current.hp = Math.min(current.maxHp, current.hp + curaTotal)

                await interaction.deferUpdate()

                await updateBattleMessage(
                    batalha,
                    `\u2764 ${current.nome} recuperou ${curaTotal} de vida!`,
                    2000
                )

                for (const item of itensUsados) {
                    await removeItem(current.id, item.id, 1)
                }

                const result = require('../RPG/battleManager').checkBattleEnd?.(batalha)
                if (result) {
                    await rewardsAndEnd(batalha, result)
                    return
                }

                nextTurn(batalha)
                await processTurn(batalha)
                break
            }

            case 'magia': {
                const selecionados = interaction.fields.getStringSelectValues('magiaSelect')
                const targets = interaction.fields.getStringSelectValues('targetSelect')

                const item = await obterUnicoItem(Number(selecionados[0]))

                const batalha = getBattleById(battleId)
                if (!batalha) return

                const current = getCurrentTurn(batalha)
                const participanteValido = [...batalha.players, ...batalha.enemies]
                    .some(personagem => personagem.id === interaction.user.id && personagem.isHuman)

                if (!participanteValido) {
                    return interaction.reply({
                        content: 'Voce nao faz parte dessa batalha.',
                        ephemeral: true
                    })
                }

                if (current.id !== interaction.user.id) {
                    return interaction.reply({
                        content: 'Nao e seu turno!',
                        ephemeral: true
                    })
                }

                const targetId = targets[0]
                const participante = [...batalha.players, ...batalha.enemies]
                    .find(p => String(p.id) === String(targetId))

                if (!participante) {
                    return interaction.reply({
                        content: 'Alvo invalido.',
                        ephemeral: true
                    })
                }

                const damage = item.ataque || 0
                let damageApplied = 0

                if (damage > 0) {
                    damageApplied = Math.max(1, Math.floor(damage))
                    participante.hp -= damageApplied
                    if (participante.hp <= 0) {
                        participante.hp = 0
                        participante.alive = false
                    }
                }

                if (item.mana && item.mana > 0) {
                    if (current.mana < item.mana) {
                        return interaction.reply({
                            embeds: [
                                criarEmbed({
                                    description: `Voce nao tem mana suficiente para usar **${item.nome}**.`,
                                    color: 'Blue'
                                })
                            ],
                            ephemeral: true
                        })
                    }

                    current.mana -= item.mana
                    if (current.mana < 0) {
                        current.mana = 0
                    }
                }

                const statusEffect = participante.alive
                    ? tryApplyStatusEffect(item, participante)
                    : null

                await interaction.deferUpdate()

                const hitText = damageApplied > 0
                    ? `${current.nome} causou ${damageApplied} de dano em ${participante.nome}`
                    : `${current.nome} usou ${item.nome} em ${participante.nome}`

                await updateBattleMessage(
                    batalha,
                    `✨ ${hitText}${statusEffect?.appliedStatusText || ''}`,
                    2000
                )

                const result = require('../RPG/battleManager').checkBattleEnd?.(batalha)
                if (result) {
                    await rewardsAndEnd(batalha, result)
                    return
                }

                nextTurn(batalha)
                await processTurn(batalha)
                break
            }

            case 'equipar': {
                const armaSelec = interaction.fields.getStringSelectValues('arma') || []
                const armaduraSelec = interaction.fields.getStringSelectValues('armadura') || []
                const calcaSelec = interaction.fields.getStringSelectValues('calca') || []

                await interaction.deferReply({ flags: [MessageFlags.Ephemeral] })

                await equiparItem(id, {
                    arma: armaSelec.length > 0 && armaSelec[0] !== '0' ? Number(armaSelec[0]) : false,
                    armadura: armaduraSelec.length > 0 && armaduraSelec[0] !== '0' ? Number(armaduraSelec[0]) : false,
                    calca: calcaSelec.length > 0 && calcaSelec[0] !== '0' ? Number(calcaSelec[0]) : false
                })

                interaction.editReply({
                    embeds: [
                        criarEmbed({
                            description: 'Itens equipados com sucesso!',
                            color: 'Green'
                        })
                    ],
                    flags: 64
                })
                break
            }

            case 'confirmarcompra': {
                const itemID = parseInt(interaction.customId.split(':')[2])
                const userID = interaction.customId.split(':')[3]
                const quantidade = parseInt(interaction.fields.getTextInputValue('quantidade'))

                await interaction.deferReply({ flags: [MessageFlags.Ephemeral] })

                const item = await obterUnicoItem(itemID)
                const res = await api.get(`/heroi/${userID}`)
                const heroi = res.data
                const moeda = heroi.moeda
                const totalPrice = item.preco * quantidade

                if (moeda < totalPrice) {
                    return interaction.editReply({
                        embeds: [
                            criarEmbed({
                                description: `Voce nao tem moedas suficientes para comprar ${quantidade}x **${item.nome}**. Voce precisa de **${totalPrice}** moedas, mas voce so tem **${moeda}** moedas.`,
                                color: 'Red'
                            })
                        ],
                        flags: [MessageFlags.Ephemeral]
                    })
                }

                await api.patch(`/heroi/${userID}`, {
                    moeda: moeda - totalPrice
                })

                await addItem(interaction.user.id, itemID, quantidade)
                interaction.editReply({
                    embeds: [
                        criarEmbed({
                            description: `Voce comprou ${quantidade}x **${item.nome}** por **${totalPrice}** moedas!`,
                            color: 'Green'
                        })
                    ],
                    flags: [MessageFlags.Ephemeral]
                })
                break
            }

            default:
                break
        }
    } else if (prefix === 'system') {
        switch (action) {
            case 'criarmensagem': {
                const titulo = interaction.fields.getTextInputValue('titulo')
                const conteudo = interaction.fields.getTextInputValue('conteudo')
                const canal = interaction.fields.getStringSelectValues('canaltexto')

                const channel = await interaction.guild.channels.fetch(canal[0])

                const container = new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder({
                            content: `# ${titulo}`
                        })
                    )
                    .addSeparatorComponents(
                        new SeparatorBuilder({
                            spacing: SeparatorSpacingSize.Large,
                            divider: true
                        })
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder({
                            content: conteudo
                        })
                    )

                await channel.send({ components: [container], flags: [MessageFlags.IsComponentsV2] })
                break
            }

            case 'alterarBanner': {
                const bannerId = parseInt(interaction.fields.getStringSelectValues('banner'))
                await interaction.deferReply({ flags: [MessageFlags.Ephemeral] })

                api.patch(`/usuario/${id}`, {
                    wallpaper: bannerId
                })

                const { conteiner, attachment } = await require('../Utils/utilsPerfil').creatPerfil(interaction.user.id, bannerId, interaction, 'usuario')

                await interaction.editReply({
                    components: [conteiner],
                    files: [attachment],
                    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
                })
                break
            }

            default:
                break
        }
    }
}

module.exports = { ModalHandleAction }
