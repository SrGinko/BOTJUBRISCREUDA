const { EmbedBuilder } = require("discord.js");

/***
 * @description Função para lidar com erros de forma padronizada
 * @param {Interaction} interaction - A interação do Discord que gerou o erro
 * @param {String} mensagem - A mensagem de erro a ser exibida para o usuário
 * @param {String} erro - O título do erro a ser exibido no container
 */
async function handleError(interaction, mensagem, erro) {
    const embed = new EmbedBuilder()
        .setTitle(erro)
        .setDescription(mensagem)
        .setColor(0xff0000);

    const replyData = {
        embeds: [embed],
        ephemeral: true
    };

    const editData = {
        embeds: [embed]
    };

    try {
        if (interaction.deferred || interaction.replied) {
            return await interaction.editReply(editData);
        }

        return await interaction.reply(replyData);
    } catch (error) {
        console.error('Falha ao enviar mensagem de erro inicial:', error);

        if (interaction.replied || interaction.deferred) {
            try {
                return await interaction.followUp(replyData);
            } catch (followError) {
                console.error('Falha ao enviar followUp de erro:', followError);
            }
        }

        if (typeof interaction.update === 'function') {
            try {
                return await interaction.update(editData);
            } catch (updateError) {
                console.error('Falha ao atualizar interação de erro:', updateError);
            }
        }

        if (!interaction.replied) {
            try {
                return await interaction.reply(replyData);
            } catch (replyError) {
                console.error('Falha ao responder interação de erro:', replyError);
            }
        }
    }
}

module.exports = { handleError };