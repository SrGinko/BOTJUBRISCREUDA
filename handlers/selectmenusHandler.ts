import { EmbedBuilder, type StringSelectMenuInteraction } from 'discord.js'
import { handleHydraSelect } from './hydraHandler'

export async function SelectMenusHandleAction(interaction: StringSelectMenuInteraction): Promise<void> {
    const idMenu = interaction.customId

    if (idMenu === 'hydra' || idMenu.startsWith('hydra:select:')) {
        await handleHydraSelect(interaction)
        return
    }

    if (idMenu !== 'server') return

    const server = interaction.values[0]
    const embed = new EmbedBuilder().setColor('Green')

    if (server === 'java') {
        embed
            .setDescription('Servidor Minecraft Java')
            .setFields({ name: 'Servidor', value: 'manicomio.minecrafthost.com.br' })
        await interaction.reply({ embeds: [embed] })
    } else if (server === 'bedrock') {
        embed
            .setDescription('Servidor Minecraft Bedrock')
            .setFields(
                { name: 'Servidor', value: 'valk.lura.pro' },
                { name: 'Porta', value: '35606' },
            )
        await interaction.reply({ embeds: [embed] })
    }
}
