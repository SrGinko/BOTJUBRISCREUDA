const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')

const embed = new EmbedBuilder()
    .setColor('Random')
    .setTitle('Selecione a cor que deseja')
    .setDescription('Clique para mudar a cor que deseja ter no servidor e clique novamente para remover a cor')
    .addFields(
        {name: 'Vermelho', value: '🔴'},
        {name: 'Laranja', value: '🟠'},
        {name: 'Amarelo', value: '🟡'},
        {name: 'Verde', value: '🟢'},
        {name: 'Azul', value: '🔵'},
        {name: 'Roxo', value: '🟣'}
    )


module.exports = {
    data: new SlashCommandBuilder()
        .setName('cores')
        .setDescription('Cores nos Usuarios'),
        
        async execute(interaction){
            interaction.reply({embeds: [embed]})
           const mensagem =  await interaction.fetchReply()

           await mensagem.react('🔴')
           await mensagem.react('🟠')
           await mensagem.react('🟡')
           await mensagem.react('🟢')
           await mensagem.react('🔵')
           await mensagem.react('🟣')
        }
}