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

/**
 * 
 * @param {Inteiro} userId id usuário
 * 
 */
async function addLVL(userId) {

    const selectXp = db.prepare(`SELECT xp from users WHERE id = ?`)
    const selectLvl = db.prepare(`SELECT lvl from users WHERE id = ?`)
    const updateLvl = db.prepare(`UPDATE users SET lvl = ? WHERE id = ?`)
    const updatexp = db.prepare(`UPDATE users SET lvl = ? WHERE id = ?`)

    var experiencia = selectXp.get(userId)
    var nivel = selectLvl.get(userId)

    switch (nivel.lvl) {
        case 1:
            if (experiencia.xp >= 100) {
                let newXp = 100 - experiencia.xp
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 100
            break;
        case 2:
            if (experiencia.xp >= 500) {
                let newXp = 500 - experiencia.xp
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
                
            }
            return 500
            break;
        case 3:
            if (experiencia.xp >= 1000) {
                let newXp = 1000 - experiencia.xp
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 1000
            break;
        case 4:
            if (experiencia.xp >= 1500) {
                let newXp = 1500 - experiencia.xp
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 1500
            break;
        case 5:
            if (experiencia.xp >= 2000) {
                let newXp = 2000 - experiencia.xp
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 2000
            break;
        case 6:
            if (experiencia.xp >= 3000) {
                let newXp = 3000 - experiencia.xp
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 3000
            break;
        case 7:
            if (experiencia.xp >= 4000) {
                let newXp = 4000 - experiencia.xp
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 4000
            break;
        case 8:
            if (experiencia.xp >= 6000) {
                let newXp = 6000 - experiencia.xp
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 6000
            break;
        case 9:
            if (experiencia.xp >= 8000) {
                let newXp = 8000 - experiencia.xp
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 8000
            break;
        case 10:
            if (experiencia.xp >= 10000) {
                let newXp = 10000 - experiencia.xp
                let newLvl = nivel.lvl + 1
                updateLvl.run(newLvl, userId)
                updatexp.run(newXp, userId)
            }
            return 10000
            break;
        default:
            break;
    }
}   

module.exports = { controler, addXp, Hoje, addLVL }