const { ContainerBuilder, MessageFlags } = require("discord.js");

async function handleError(interaction, mensagem){
    const container = new ContainerBuilder({
        accent_color: 0xff0000,
        components: [
            new TextDisplayBuilder({
                content: mensagem
            })
        ]
    })

    await interaction.reply({ components: [container], flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2] })

}