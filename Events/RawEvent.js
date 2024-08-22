const { Events, Client, GatewayIntentBits } = require('discord.js')
const interaction = require('./interaction')
const { execute } = require('./interaction')

module.exports = {
    name: Events.Raw,
    async execute(dados) {
        //conole.log(dados)
        if (dados.t !== "MESSAGE_REACTION_ADD" && dados.t !== "MESSAGE_REACTION_REMOVE") return
        if (dados.d.message_id !== "1276276900255502507") return

        let servidor = client.guild.get("1031036294433865850")
        console.log(servidor)
        const player = interaction.guild.roles.cache.find(role => role.id == "1276284530109448343")


        if (dados.t === "MESSAGE_REACTION_ADD") {
            if (dados.d.emoji_id === "1271691887606239274") {
                if (member.roles.has("1271691887606239274")) {
                    await interaction.reply({ content: `Você ja tem este cargo!`, ephemeral: true })
                } else member.roles.add(player)
            }
        }
        if (dados.t === "MESSAGE_REACTION_ REMOVE") {
            if (dados.d.emoji_id === "1271691887606239274") {
                if (member.roles.has("1271691887606239274")) {
                    member.roles.remove(player)
                } else return
            }
        }
    }
}