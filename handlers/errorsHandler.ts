import {
    EmbedBuilder,
    type ButtonInteraction,
    type ChatInputCommandInteraction,
    type ModalSubmitInteraction,
    type StringSelectMenuInteraction,
} from 'discord.js'

type ErrorInteraction =
    | ButtonInteraction
    | ChatInputCommandInteraction
    | ModalSubmitInteraction
    | StringSelectMenuInteraction

export async function handleError(
    interaction: ErrorInteraction,
    mensagem: string,
    erro: string,
): Promise<void> {
    const embed = new EmbedBuilder()
        .setTitle(erro)
        .setDescription(mensagem)
        .setColor(0xff0000)

    const replyData = { embeds: [embed], ephemeral: true }
    const editData = { embeds: [embed] }

    try {
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply(editData)
            return
        }

        await interaction.reply(replyData)
    } catch (error) {
        console.error('Falha ao enviar mensagem de erro inicial:', error)

        if (interaction.replied || interaction.deferred) {
            try {
                await interaction.followUp(replyData)
            } catch (followError) {
                console.error('Falha ao enviar followUp de erro:', followError)
            }
        }

        if ('update' in interaction && typeof interaction.update === 'function') {
            try {
                await interaction.update(editData)
            } catch (updateError) {
                console.error('Falha ao atualizar interação de erro:', updateError)
            }
        }

        if (!interaction.replied) {
            try {
                await interaction.reply(replyData)
            } catch (replyError) {
                console.error('Falha ao responder interação de erro:', replyError)
            }
        }
    }
}
