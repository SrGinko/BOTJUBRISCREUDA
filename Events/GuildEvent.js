const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, MessageFlags } = require('discord.js')
const { EventEmitter } = require('events')
const { icone } = require('../Utils/emojis')
const { criarEmbed } = require('../Utils/embedFactory')

const guildEvent = new EventEmitter

guildEvent.on('conquista', ({ conquista, xp, user, channel }) => {

    const container = new ContainerBuilder({
        accent_color: 0x5338eb,
        components: [
            new TextDisplayBuilder({
                content: `#  Conquista Adiquirida!`
            }),
            new SeparatorBuilder({
                spacing: SeparatorSpacingSize.Small,
                divider: false
            }),
            new TextDisplayBuilder({
                content: `### Parabéns ${user}! \n Você adiquiriu a **Conquista** ${conquista} \n Você também recebeu ${xp} de xp ! \n > Jubiscreuda System`
            })
        ]
    })
    channel.send({ components: [container], flags: [MessageFlags.IsComponentsV2] })
})

guildEvent.on('addcanal', ({ nomeCanal, CapaCanal, channel }) => {

    channel.send({embeds:[
        criarEmbed({
            title: 'Canal Adicionado',
            description: `Canal ${nomeCanal} adicionado !`,
            color: 'Green',
            image: `${CapaCanal}`,
            footer: 'LifeFlix | Monteiro Apps'
        })
    ]})
})

module.exports = guildEvent