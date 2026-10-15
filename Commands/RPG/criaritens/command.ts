import { EmbedBuilder, MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { api } from '../../../service/axiosClient'
import { addXp } from '../../../Utils/xp'

const itemAdministratorId = '770818264691114016'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('criaritens')
        .setDescription('Comando para criar itens')
        .addStringOption(option => option.setName('nomeitem').setDescription('Nome do item').setRequired(true))
        .addStringOption(option => option.setName('descricaoitem').setDescription('Descrição do item').setRequired(true))
        .addStringOption(option => option.setName('raridade').setDescription('Raridade do item').setRequired(true).addChoices(
            { name: 'Comum', value: 'COMUM' },
            { name: 'Rara', value: 'RARA' },
            { name: 'Épica', value: 'EPICO' },
            { name: 'Lendária', value: 'LENDARIO' },
        ))
        .addStringOption(option => option.setName('tipo').setDescription('Tipo do item').setRequired(true).addChoices(
            { name: 'Armadura', value: 'ARMADURA' },
            { name: 'Calça', value: 'CALCA' },
            { name: 'Arma', value: 'ARMA' },
            { name: 'Consumível', value: 'CONSUMIVEL' },
            { name: 'Outro', value: 'OUTRO' },
            { name: 'Magia', value: 'MAGIA' },
        ))
        .addIntegerOption(option => option.setName('valor').setDescription('Preço do item').setRequired(true).setMinValue(0))
        .addIntegerOption(option => option.setName('ataque').setDescription('Valor de dano, se aplicável').setMinValue(0))
        .addIntegerOption(option => option.setName('defesa').setDescription('Valor de defesa, se aplicável').setMinValue(0))
        .addIntegerOption(option => option.setName('heal').setDescription('Valor de cura, se aplicável').setMinValue(0))
        .addStringOption(option => option.setName('imagem').setDescription('URL da imagem do item')),

    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.user.id !== itemAdministratorId) {
            return interaction.reply({ content: 'Você não tem permissão para usar este comando.', flags: MessageFlags.Ephemeral })
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral })
        try {
            await api.post('/itens', {
                nome: interaction.options.getString('nomeitem', true),
                descricao: interaction.options.getString('descricaoitem', true),
                raridade: interaction.options.getString('raridade', true),
                tipo: interaction.options.getString('tipo', true),
                preco: interaction.options.getInteger('valor', true),
                imagem: interaction.options.getString('imagem'),
                ataque: interaction.options.getInteger('ataque'),
                defesa: interaction.options.getInteger('defesa'),
                heal: interaction.options.getInteger('heal'),
            })

            const embed = new EmbedBuilder()
                .setTitle('Item criado com sucesso! ✅')
                .setColor('Green')
                .setTimestamp()
                .setFooter({ text: 'By Jubriscreuda', iconURL: 'https://i.ytimg.com/vi/s6V4BjURhOs/maxresdefault.jpg' })
            void addXp(interaction.user.id, 20).catch(console.error)
            return interaction.editReply({ embeds: [embed] })
        } catch (error) {
            console.error('Erro ao criar item:', error)
            return interaction.editReply({ content: 'Não foi possível criar o item. Tente novamente mais tarde.' })
        }
    },
}
