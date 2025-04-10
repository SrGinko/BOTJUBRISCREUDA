const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { addXp, addLVL } = require('../../Controller')
const {IA_API} = process.env
const OpenAi = require('openai')

const axios = require('axios')
const dotenv = require('dotenv')
const { stream } = require("play-dl")
dotenv.config()

const openai = new OpenAi({
    baseURL: 'https://api.deepseek.com',
    apiKey: IA_API
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('perguntas')
        .addStringOption(option => option.setName('pergunta').setDescription('Realize uma pergunta').setRequired(true)),


    async execute(interaction) {

        const userId = interaction.user.id
        const { options } = interaction

        const pergunta = options.getString('pergunta')

        async function chatComIA(mensagem) {
            try {

                const resposta  = await openai.chat.completions.create({
                    model: "deepseek-coder",
                    messages: [{ role: "user", content: mensagem }],
                    model: "deepseek-chat"
                    
                });

                return resposta.choices[0].menssage.content || "⚠️ Nenhuma resposta gerada.";
            } catch (erro) {
                console.error("Erro ao chamar API:", erro.response?.data || erro.message);
                return "❌ Ocorreu um erro ao processar sua pergunta.";
            }
        }

        await interaction.deferReply();

        try {
            const resposta = await chatComIA(pergunta);

            interaction.editReply({ content: resposta.substring(0, 2000), ephemeral: true });
        } catch (erro) {
            console.error("Erro interno:", erro.message);
            await interaction.editReply("❌ Ocorreu um erro ao processar sua pergunta.");
        }
    }
}
