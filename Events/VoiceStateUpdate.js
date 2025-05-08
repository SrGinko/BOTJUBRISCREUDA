const { Events, EmbedBuilder } = require('discord.js');

const embed = new EmbedBuilder()

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {

        const user = newState.member.user
        const imgUsuario = newState.member.user.displayAvatarURL()
        const channel = newState.guild.channels.cache.get('1369886723479175269')

        if(!oldState.channel && newState){
            embed.setColor('Green')
            embed.setDescription(`${user} entrou no canal ${newState.channel.name} !`)
            embed.setTimestamp()
            embed.setFooter({text: user.username, iconURL: imgUsuario})

            channel.send({embeds: [embed]})
        }else if(oldState.channel && !newState.channel){
            embed.setColor('Red')
            embed.setDescription(`${user} saiu do canal ${oldState.channel.name} !`)
            embed.setTimestamp()
            embed.setFooter({text: user.username, iconURL: imgUsuario})
            
            channel.send({embeds: [embed]})
        }
    }
}