const { SlashCommandBuilder, StringSelectMenuBuilder, ContainerBuilder, TextDisplayBuilder, ActionRowBuilder, MessageFlags, SectionBuilder, ThumbnailBuilder, hyperlink } = require("discord.js")
const hydraLinks = require('../../data/hydraLinks')
const { getRandonCores } = require("../../Utils/cores")
const { addXp } = require("../../Utils/xp");
const { icone } = require("../../Utils/emojis");
const emojisData = require("../../data/emojis");

hydraLinks.sort((a, b) => {
    if(a.name === 'Todos') return -1;
    if(b.name === 'Todos') return 1;

    return a.name.localeCompare(b.name, 'pt-br')
});



module.exports = {
    data: new SlashCommandBuilder()
        .setName('hydra')
        .setDescription('Acesso ao Link de Download da HydraLaucher'),

    async execute(interaction) {
        const userId = interaction.user.id
        await interaction.deferReply({ flags: MessageFlags.Ephemeral })

        const row = new StringSelectMenuBuilder()
            .setCustomId('hydra')
            .setPlaceholder('Selecione o link')
            .setMinValues(1)
            .setMaxValues(hydraLinks.length)
            .addOptions(hydraLinks.map(item => ({
                label: item.name,
                value: item.id,
            })))

        const container = new ContainerBuilder({
            accent_color: 0xffffff,
        })

        container.addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder({
                        content: `# HydraLauncher
- Link de Download da HydraLauncher ${hyperlink('Clique aqui', 'https://github.com/hydralauncher/hydra/releases/')}
- Tutorial de como Instalar ${hyperlink('Clique aqui', 'https://youtu.be/Yo9fka6A6RE?si=zSjO1txthuQsFcjU')}
`
                    })
                )
                .setThumbnailAccessory(
                    new ThumbnailBuilder({
                        media: { url: 'https://github.com/hydralauncher/hydra/raw/main/resources/icon.png' }
                    })
                )
        )

        container.addActionRowComponents(
            new ActionRowBuilder()
                .addComponents(row)
        )

        addXp(userId, 10)
        await interaction.editReply({ flags: [MessageFlags.IsComponentsV2], components: [container] })
    }
}