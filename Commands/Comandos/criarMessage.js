const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ChannelType, TextDisplayBuilder, LabelBuilder, ComponentType, LabelAssertions } = require('discord.js')
const { vault } = require('googleapis/build/src/apis/vault')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('criarmessage')
        .setDescription('Cria uma mensagem para ser enviada a um canal'),

    async execute(interaction) {

        try{

        if (interaction.user.id === '770818264691114016') {
            
            const channelTexts = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildText)
            
            const modal = new ModalBuilder({
                title: 'Enviar Mensagem',
                custom_id: `system:criarmensagem:${interaction.user.id}`,
            })
            .addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: 'Preencha os campos obrigatórios para Criar a mensagem'
                })
            )
            .addLabelComponents(
                new LabelBuilder({
                    label: 'Titulo:',
                    description: 'Insira o Titulo do container',
                    component:{
                        type: ComponentType.TextInput, 
                        style: TextInputStyle.Short,
                        custom_id: "titulo",
                        required: false,
                    }
                })
            )
            .addLabelComponents(
                new LabelBuilder({
                    label: "Conteudo:",
                    description: "Insira o conteúdo da mensagem",
                    component:{
                        type: ComponentType.TextInput,
                        style: TextInputStyle.Paragraph,
                        custom_id: 'conteudo',
                        required: true
                    }
                })
            )
            .addLabelComponents(
                new LabelBuilder({
                    label: "Canal:",
                    description: "Selecione qual canal de texto",
                    component:{
                        type: ComponentType.StringSelect,
                        custom_id: 'canaltexto',
                        required: true,
                        options: channelTexts.map(ch => (
                            {label: `${ch.name}`, value: `${ch.id}`}
                        )).slice(0,25)
                    }
                })
            )
        
            await interaction.showModal(modal)
        }else{
            await interaction.reply({content: 'Apenas o meu criador pode usar esse comando!', ephemeral: true})
        }
    }catch(erro){
        console.log(erro)
    }

    }
}