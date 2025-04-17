const { Events, EmbedBuilder } = require('discord.js')
const { addXp, addLVL } = require('../Controller')
const dotenv = require('dotenv')
dotenv.config()
const { URL_USUARIO } = process.env

const embed = new EmbedBuilder()
    .setColor('Random')
    .setTitle('Comandos')
    .setFields(
        { name: '``/perfil``', value: 'Consultar seu Nível e quantidade de XP', inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: '``/mac``', value: 'Realiza uma busca da marca do equipamento pelo mac', inline: true },
        { name: '``/minecraft``', value: 'Minecraft apk para download', inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: '`/alterbanner`', value: 'Alteração do banner do perfil', inline: true },
        { name: '``/pokemmo``', value: 'Acesso aos Links para poder Jogar PokeMMO', inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: '``/down``', value: 'Puxar o arquivo do banco de dados por ID', inline: true },
        { name: '``/upload``', value: 'Subir um arquivo para o BD do bot', inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: '`/documentacao`', value: 'Documentações de algumas linguagens de programação', inline: true },

    )
module.exports = {
    name: Events.MessageCreate,
    on: true,
    async execute(message) {


        if (message.channel.type === 1 && !message.author.bot) {
            if (message.content === 'oi' || message.content === 'Ola') {

                await message.channel.sendTyping();
                await message.reply({ content: `Olá, ${message.author}! Você poderá utilizar esses comandos no chat privado comigo`, embeds: [embed] })
            }
        }

        if (message.channel.type === 0) {
            const bot = message.guild.members.cache.get(message.author.id)
            const cargo = '1286201893516742696'
            if (message.channel.id !== '1053145878594068571') {
                if (bot) {
                    if (bot && bot.roles.cache.has(cargo)) {
                        message.delete()
                    }
                }
            }

            if(!message.author.bot){

                addXp(message.author.id, 10)
                addLVL(message.author.id)
            }

            if (message.channel.id === '1038287340889706498') {
                console
                const jogoGratis = message.guild.roles.cache.find(r => r.name === 'JogosGratis')
                const chat = message.client.channels.cache.get('1031036295482454069')

                const gratis = new EmbedBuilder()
                    .setColor('Random')
                    .setDescription(`Venha pegar seus jogos grátis da semana! ${jogoGratis}`)
                    .addFields(
                        { name: 'Acesse por aqui:', value: 'https://discord.com/channels/1031036294433865850/1038287340889706498' }
                    )

                await chat.send({ embeds: [gratis] })
            }
        }
    }
}