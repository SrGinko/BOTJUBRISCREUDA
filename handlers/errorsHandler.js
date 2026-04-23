const { ContainerBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");

/***
 * @description Função para lidar com erros de forma padronizada
 * @param {Interaction} interaction - A interação do Discord que gerou o erro
 * @param {String} mensagem - A mensagem de erro a ser exibida para o usuário
 * @param {String} erro - O título do erro a ser exibido no container
 */
async function handleError(interaction, mensagem, erro) {

    const container = new ContainerBuilder({
        accent_color: 0xff0000,
        components: [
            new TextDisplayBuilder({
                content: `## ${erro} \n ${mensagem}`
            })
        ]
    })

    if (interaction.deferred || interaction.replied) {
        await interaction.update({ components: [container], flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2] })
    } else {
        await interaction.update({ components: [container], flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2] })
    }

}

module.exports = { handleError }