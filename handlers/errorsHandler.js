const { ContainerBuilder, MessageFlags } = require("discord.js");

async function handleError(interaction, mensagem, erro){
    const container = new ContainerBuilder({
        accent_color: 0xff0000,
        components: [
            new TextDisplayBuilder({
                content: `# ${erro} \n ${mensagem}`
            })
        ]
    })

    await interaction.reply({ components: [container], flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2] })

}