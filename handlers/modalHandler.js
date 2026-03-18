const { ContainerBuilder, TextDisplayBuilder, MessageFlags, SeparatorBuilder, SeparatorSpacingSize } = require('discord.js')
const { criarEmbed } = require('../Utils/embedFactory')
const { api } = require('../Utils/axiosClient')
const { addItem, removeItem } = require('../Utils/itensInventario')
const { obterUnicoItem, equiparItem } = require('../Utils/itensInventario')
const { enemyTurn, updateBattleMessage, getBattle } = require('../RPG/battleManager')

async function ModalHandleAction(interaction) {
    const [prefix, action, id] = interaction.customId.split(':')

    if (prefix === 'tv') {
        switch (action) {
            case 'addcanal':

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
                    ], flags: 64
                })
                const channel = await interaction.guild.channels.fetch('1428656070552850483')
                guildEvent.emit('addcanal', { nomeCanal: nomeCanal, CapaCanal: capaCanal, channel: channel })

                break;

            default:
                break;
        }
    } if (prefix === 'rpg') {
        switch (action) {
            case 'curar': {
                const selecionados = interaction.fields.getStringSelectValues('consumivelSelect')

                const itensUsados = await Promise.all(
                    selecionados.map(async (itemId) => {
                        return obterUnicoItem(Number(itemId))
                    })
                )

                const batalha = getBattle(id)

                const curaTotal = itensUsados.reduce((total, item) => {
                    const porcentagem = item.heal || 0
                    const cura = Math.floor((batalha.player.maxHp * porcentagem) / 100)
                    return total + cura
                }, 0)

                batalha.player.hp = Math.min(
                    batalha.player.maxHp,
                    batalha.player.hp + curaTotal
                )

                await interaction.deferUpdate()

                await updateBattleMessage(
                    batalha,
                    `💚 Você usou itens e recuperou ${curaTotal} de vida!`
                )

                for (const item of itensUsados) {
                    await removeItem(id, item.id, 1)
                }

                await enemyTurn(batalha)

            }
                break;
            case 'equipar': {
                const armaSelec = interaction.fields.getStringSelectValues('arma') || []
                const aramaduraSelec = interaction.fields.getStringSelectValues('armadura') || []
                const calcaSelec = interaction.fields.getStringSelectValues('calca') || []
                await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
                await equiparItem(id, {
                    arma: armaSelec.length > 0 || '0' ? Number(armaSelec[0]) : false,
                    armadura: aramaduraSelec.length || '0' > 0 ? Number(aramaduraSelec[0]) : false,
                    calca: calcaSelec.length > 0 || '0' ? Number(calcaSelec[0]) : false,
                })

                interaction.editReply({
                    embeds: [
                        criarEmbed({
                            description: 'Itens equipados com sucesso!',
                            color: 'Green'
                        })
                    ], flags: 64
                })
            }
                break;
            case 'confirmarcompra': {
                const itemID = parseInt(interaction.customId.split(':')[2])
                const userID = interaction.customId.split(':')[3]
                const quantidade = parseInt(interaction.fields.getTextInputValue('quantidade'))

                await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

                const item = await obterUnicoItem(itemID)
                const res = await api.get(`/heroi/${userID}`)
                const heroi = res.data
                const moeda = heroi.moeda
                const totalPrice = item.preco * quantidade

                if (moeda < totalPrice) {
                    return interaction.editReply({
                        embeds: [
                            criarEmbed({
                                description: `Você não tem moedas suficientes para comprar ${quantidade}x **${item.nome}**. Você precisa de **${totalPrice}** moedas, mas você só tem **${moeda}** moedas.`,
                                color: 'Red'
                            })
                        ], flags: [MessageFlags.Ephemeral]
                    })
                }
                await api.patch(`/heroi/${userID}`, {
                    moeda: moeda - totalPrice
                })

                await addItem(heroi.id, itemID, quantidade)
                interaction.editReply({
                    embeds: [
                        criarEmbed({
                            description: `Você comprou ${quantidade}x **${item.nome}** por **${totalPrice}** moedas!`,
                            color: 'Green'
                        })
                    ], flags: [MessageFlags.Ephemeral]
                })
            }
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
            }
                break;
            case 'alterarBanner': {
                const bannerId = parseInt(interaction.fields.getStringSelectValues('banner'))
                await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

                api.patch(`/usuario/${id}`, {
                    wallpaper: bannerId
                })

                const { conteiner, attachment } = await require('../Utils/utilsPerfil').creatPerfil(interaction.user, bannerId, interaction)


                await interaction.editReply({
                    components: [conteiner],
                    files: [attachment],
                    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
                })
            }
                break;
        }
    }
}

module.exports = { ModalHandleAction }