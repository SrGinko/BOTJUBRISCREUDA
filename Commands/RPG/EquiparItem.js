const { SlashCommandBuilder, TextDisplayBuilder, ModalBuilder, LabelBuilder, ComponentType } = require('discord.js')
const { obterItensInventario } = require('../../Utils/itensInventario')



module.exports = {
    data: new SlashCommandBuilder()
        .setName('equipar')
        .setDescription('Equipa os Itens equipaveis no seu heroi'),

    async execute(interaction) {
        const userId = interaction.user.id

        const inventario = await obterItensInventario(userId)
        const itensEquipaveis = inventario.map(itens => {
            return {
                itens: itens.item,
                quantidade: itens.quantidade
            }
        }).filter(item => ['ARMA', 'ARMADURA', 'CALCA'].includes(item.itens.tipo))

        const modal = new ModalBuilder({
            title: 'Equipar Itens',
            custom_id: `rpg:equipar:${userId}`,
        })
            .addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: 'Selecione os itens que deseja equipar no menu abaixo e clique em Enviar.',
                })
            )
        if (itensEquipaveis.filter(item => item.itens.tipo === 'ARMA').length > 0) {

            modal.addLabelComponents(
                new LabelBuilder({
                    label: 'Armas:',
                    description: 'Selecione a arma que deseja equipar.',
                    component: {
                        type: ComponentType.StringSelect,
                        custom_id: 'arma',
                        required: false,
                        options: itensEquipaveis.filter(item => item.itens.tipo === 'ARMA').map(item => ({
                            label: `${item.itens.nome}`,
                            description: `Ataque: ${item.itens.ataque} | Quantidade: ${item.quantidade}`,
                            value: String(item.itens.id)
                        }))
                    }

                }))
        } else {
            modal.addLabelComponents(
                new LabelBuilder({
                    label: 'Armas:',
                    description: 'Você não possui itens do tipo Arma equipavel no seu inventário.',
                    component: {
                        type: ComponentType.StringSelect,
                        custom_id: 'arma',
                        required: false,
                        options: [
                            {
                                label: 'Nenhum item disponível',
                                description: 'Você não possui itens do tipo Arma equipavel no seu inventário.',
                                value: '0'
                            }
                        ]
                    }
                })
            )
        }

        if (itensEquipaveis.filter(item => item.itens.tipo === 'ARMADURA').length > 0) {

            modal.addLabelComponents(
                new LabelBuilder({
                    label: 'Armadura:',
                    description: 'Selecione a armadura que deseja equipar.',
                    component: {
                        type: ComponentType.StringSelect,
                        custom_id: 'armadura',
                        required: false,
                        options: itensEquipaveis.filter(item => item.itens.tipo === 'ARMADURA').map(item => ({
                            label: `${item.itens.nome}`,
                            description: `Defesa: ${item.itens.defesa} | Quantidade: ${item.quantidade}`,
                            value: String(item.itens.id)
                        }))
                    }

                })
            )
        } else {
            modal.addLabelComponents(
                new LabelBuilder({
                    label: 'Armadura:',
                    description: 'Você não possui itens do tipo Armadura equipavel no seu inventário.',
                    component: {
                        type: ComponentType.StringSelect,
                        custom_id: 'armadura',
                        required: false,
                        options: [
                            {
                                label: 'Nenhum item disponível',
                                description: 'Você não possui itens do tipo Armadura equipavel no seu inventário.',
                                value: '0'
                            }
                        ]
                    }
                })
            )
        }

        if (itensEquipaveis.filter(item => item.itens.tipo === 'CALCA').length > 0) {

            modal.addLabelComponents(
                new LabelBuilder({
                    label: 'Calça:',
                    description: 'Selecione a calça que deseja equipar.',
                    component: {
                        type: ComponentType.StringSelect,
                        custom_id: 'calca',
                        required: false,
                        options: itensEquipaveis.filter(item => item.itens.tipo === 'CALCA').map(item => ({
                            label: `${item.itens.nome}`,
                            description: `Defesa: ${item.itens.defesa} | Quantidade: ${item.quantidade}`,
                            value: String(item.itens.id)
                        }))
                    }
                })
            )
        } else {
            modal.addLabelComponents(
                new LabelBuilder({
                    label: 'Calça:',
                    description: 'Você não possui itens do tipo Calça equipavel no seu inventário.',
                    component: {
                        type: ComponentType.StringSelect,
                        custom_id: 'calca',
                        required: false,
                        options: [
                            {
                                label: 'Nenhum item disponível',
                                description: 'Você não possui itens do tipo Calça equipavel no seu inventário.',
                                value: '0'
                            }
                        ]
                    }
                })
            )
        }

        await interaction.showModal(modal)
    }
}