const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, LabelBuilder, ComponentType, TextDisplayBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addcanal')
        .setDescription('Adiciona um Canal nos APPs'),

    async execute(interaction) {

        try {
            const modal = new ModalBuilder({
                title: 'Adicionar Canal',
                customId: 'tv:addcanal',
            })
                .addLabelComponents(
                    new LabelBuilder({
                        label: "Nome do Canal: ",
                        description: "Insira o nome do canal que deseja adicionar",
                        component: {
                            type: ComponentType.TextInput,
                            style: TextInputStyle.Short,
                            required: true,
                            custom_id: 'canalNome',
                        }
                    })
                )
            .addLabelComponents(
                new LabelBuilder({
                    label: 'URL: ',
                    description: 'Insira a URL do canal que deseja adicionar',
                    component: {
                        type: ComponentType.TextInput,
                        custom_id: 'canalUrl',
                        style: TextInputStyle.Short,
                        required: true
                    }
                })
            )
            .addLabelComponents(
                new LabelBuilder({
                    label: 'Capa URL: ',
                    description: 'Insira a URL da capa do canal que deseja adicionar',
                    component: {
                        type: ComponentType.TextInput,
                        custom_id: 'capaUrl',
                        style: TextInputStyle.Short,
                        required: true
                    }
                })
            )

            await interaction.showModal(modal)
        } catch (error) {
            console.log(error)
        }


    }
}