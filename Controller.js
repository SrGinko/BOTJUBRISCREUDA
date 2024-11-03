const { EmbedBuilder } = require('discord.js')
const db = require('./db')

const EndCitys = new EmbedBuilder()
    .setTitle('EndsCitys')
    .setColor('Purple')
    .addFields({ name: 'Clique aqui:', value: `https://discord.com/channels/1031036294433865850/1170598801648652439` })

const Nether = new EmbedBuilder()
    .setTitle('Nether')
    .setColor('Red')
    .addFields({ name: 'Clique aqui:', value: `https://discord.com/channels/1031036294433865850/1215493202069561355` })

const OverWorld = new EmbedBuilder()
    .setTitle('OverWorld')
    .setColor('Green')
    .addFields({ name: 'Clique aqui:', value: `https://discord.com/channels/1031036294433865850/1215493397230395452` })



/**
 * 
 * @param {Objeto} interaction - Necessaria para execção dos comando
 * @returns {Objeto} - Retorna valor da interação
 */

async function controler(interaction) {
    if (interaction.isStringSelectMenu()) {
        const select = interaction.values[0]

        switch (select) {
            case 'endscitys': return await interaction.reply({ embeds: [EndCitys], ephemeral: true })
                break;
            case 'nether': return await interaction.reply({ embeds: [Nether], ephemeral: true })
                break;
            case 'overworld': return await interaction.reply({ embeds: [OverWorld], ephemeral: true })
        }

    } else return
}


/**
 * 
 * @param {Inteiro} userId - id do usuário
 * @param {Inteiro} add - Quantidade de xp que será adicionada
 */

async function addXp(userId, add) {
    const selectXp = db.prepare(`SELECT xp from users WHERE id = ?`)
    const updateXp = db.prepare(`UPDATE users SET xp = ? WHERE id = ?`)

    const xp = selectXp.get(userId)
    var newXp = xp.xp + add

    await updateXp.run(newXp, userId)
}


/**
 * 
 * 
 * @returns dia, mes, ano, horas, minutos
 */
 function Hoje() {

    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();

    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');

    return { dia, mes, ano, horas, minutos }
}

module.exports = { controler, addXp, Hoje }