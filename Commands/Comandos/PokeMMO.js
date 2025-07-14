const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, TextDisplayBuilder, MessageFlags, SectionBuilder, ThumbnailBuilder } = require('discord.js');
const { getRandonCores } = require('../../Utils/Cores');

const cor = getRandonCores()

const pokeConteiner = new ContainerBuilder({
    accent_color: cor,
});

pokeConteiner.addSectionComponents(
    new SectionBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder({
                content: `# PokeMMO`
            })
        )
        .setThumbnailAccessory(
            new ThumbnailBuilder({
                media: { url: 'https://img.utdstc.com/icon/2b2/a07/2b2a079a18ba4254bcf49fba2541e4b94cc44e93e95a800e23257dc9e739c961:200' }
            })
        )
)

pokeConteiner.addSeparatorComponents({
    color: 0x000000,
    size: 'Small'
})

pokeConteiner.addSectionComponents(
    new SectionBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder({
                content: `# Dowmload PokeMMO
Clique no botão para baixar o cliente do PokeMMO`
            })
        )
        .setButtonAccessory(
            new ButtonBuilder({
                label: 'Download PokeMMO',
                style: ButtonStyle.Link,
                url: 'https://pokemmo.eu/downloads/client/'
            })
        )
)


pokeConteiner.addSectionComponents(
    new SectionBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder({
                content: `# Dowmload ROMs
Clique no botão para baixar as ROMs necessárias para jogar PokeMMO.`
            })
        )
        .setButtonAccessory(
            new ButtonBuilder({
                label: 'Download ROMs',
                style: ButtonStyle.Link,
                url: 'https://m0ve-my.sharepoint.com/:f:/g/personal/pmonteiro_m0ve_onmicrosoft_com/Emu4BxjaRbxJlels0FDtQY4Bc_xbVyfJ8aUa3gB73kHUDw?e=bQ5Ecr'
            })
        )
)



module.exports = {
    data: new SlashCommandBuilder()
        .setName('pokemmo')
        .setDescription('Acesso aos Links para poder Jogar PokeMMO'),

    async execute(interaction) {
        await interaction.reply({ components: [pokeConteiner], flags: [MessageFlags.IsComponentsV2] });
    }
}