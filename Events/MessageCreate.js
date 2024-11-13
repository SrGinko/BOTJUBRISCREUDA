const { Events, EmbedBuilder, Client } = require('discord.js')
const db = require('../db');
const { addXp, addLVL } = require('../Controller');

const embed = new EmbedBuilder()
    .setColor('Random')
    .setTitle('Comandos')
    .setFields(
        { name: '\u200B', value: '`/perfil`', inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: '\u200B', value: '`/mac`', inline: true },
        { name: '\u200B', value: '`/minecraft`', inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: '\u200B', value: '`/alterbanner`', inline: true },
        { name: '\u200B', value: '`/pokemmo`', inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: '\u200B', value: '`/down`', inline: true },
        { name: '\u200B', value: '`/upload`', inline: true },

    )
module.exports = {
    name: Events.MessageCreate,
    on: true,
    async execute(message) {


        if (message.channel.type === 1 && !message.author.bot) {
            if (message.content === 'oi' || message.content === 'Ola') {
                await message.channel.sendTyping();
                await message.reply({ content: `Olá! Você poderá utilizar esses comandos no chat privado comigo`, embeds: [embed] })
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

            if (message.channel.id === '1038287340889706498') {

                const jogoGratis = message.guild.roles.cache.find(r => r.name === 'JogosGratis')
                const chat = message.client.channels.cache.get('1031036295482454069')

                const gratis = new EmbedBuilder()
                    .setColor('Random')
                    .setDescription(`Venha pegar seus jogos grátis da semana! ${jogoGratis}`)
                    .addFields(
                        { name: '``https://discord.com/channels/1031036294433865850/1038287340889706498``', value: '\u200B' }
                    )

                await chat.send({ embeds: [gratis] })
            }

            if (message.author.bot) {
                return
            } else {

                const userId = message.author.id
                const username = message.author.globalName

                try {
                    const stmt = db.prepare(`
                      INSERT INTO users (id, username, xp, lvl) 
                      VALUES (?, ?, ?, ?)
                    `);
                    stmt.run(userId, username, 0, 1);

                } catch (error) {
                    if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {

                        addXp(userId, 10)
                        addLVL(userId)

                    } else {
                        console.error('Erro ao registrar usuário:', error);
                    }
                }
            }
        }



    }
}