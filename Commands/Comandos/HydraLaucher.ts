import { MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { addXp } from '../../Utils/xp'
import { createHydraSelection } from '../../handlers/hydraHandler'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hydra')
        .setDescription('Acesso ao Link de Download da HydraLaucher'),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral })

        void addXp(interaction.user.id, 10)
        await interaction.editReply({
            flags: [MessageFlags.IsComponentsV2],
            components: [createHydraSelection(0)],
        })
    },
}
