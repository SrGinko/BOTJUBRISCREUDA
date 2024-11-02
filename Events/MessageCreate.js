const { Events } = require('discord.js')
const db = require('../db');


module.exports = {
    name: Events.MessageCreate,
    on: true,
    async execute(message) {
        const bot = message.guild.members.cache.get(message.author.id)
        const cargo = '1286201893516742696'
        if (message.channel.id !== '1053145878594068571') {
            if (bot) {
                if (bot && bot.roles.cache.has(cargo)) {
                    message.delete()
                }
            }
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

                    const selectXp = db.prepare(`SELECT xp from users WHERE id = ?`)
                    const selectLvl = db.prepare(`SELECT lvl from users WHERE id = ?`)
                    const updateXp = db.prepare(`UPDATE users SET xp = ? WHERE id = ?`)
                    const updateLvl = db.prepare(`UPDATE users SET lvl = ? WHERE id = ?`)

                    var experiencia = selectXp.get(userId)
                    var nivel = selectLvl.get(userId)


                    switch (nivel.lvl) {
                        case 1:
                            if (experiencia.xp >= 100) {
                                let newLvl = nivel.lvl + 1
                                updateLvl.run(newLvl, userId)
                            } else {

                                let newXp = experiencia.xp + 15
                                updateXp.run(newXp, userId)
                            }
                            break;
                        case 2:
                            if (experiencia.xp >= 500) {
                                let newLvl = nivel.lvl + 1
                                updateLvl.run(newLvl, userId)
                            } else {

                                let newXp = experiencia.xp + 15
                                updateXp.run(newXp, userId)
                            }
                            break;
                        case 3:
                            if (experiencia.xp >= 1000) {
                                let newLvl = nivel.lvl + 1
                                updateLvl.run(newLvl, userId)
                            } else {

                                let newXp = experiencia.xp + 15
                                updateXp.run(newXp, userId)
                            }
                            break;
                        case 4:
                            if (experiencia.xp >= 1500) {
                                let newLvl = nivel.lvl + 1
                                updateLvl.run(newLvl, userId)
                            } else {

                                let newXp = experiencia.xp + 15
                                updateXp.run(newXp, userId)
                            }
                            break;
                        case 5:
                            if (experiencia.xp >= 2000) {
                                let newLvl = nivel.lvl + 1
                                updateLvl.run(newLvl, userId)
                            } else {

                                let newXp = experiencia.xp + 15
                                updateXp.run(newXp, userId)
                            }
                            break;
                        case 6:
                            if (experiencia.xp >= 3000) {
                                let newLvl = nivel.lvl + 1
                                updateLvl.run(newLvl, userId)
                            } else {

                                let newXp = experiencia.xp + 15
                                updateXp.run(newXp, userId)
                            }
                            break;
                        case 7:
                            if (experiencia.xp >= 4000) {
                                let newLvl = nivel.lvl + 1
                                updateLvl.run(newLvl, userId)
                            } else {

                                let newXp = experiencia.xp + 15
                                updateXp.run(newXp, userId)
                            }
                            break;
                        case 8:
                            if (experiencia.xp >= 6000) {
                                let newLvl = nivel.lvl + 1
                                updateLvl.run(newLvl, userId)
                            } else {

                                let newXp = experiencia.xp + 15
                                updateXp.run(newXp, userId)
                            }
                            break;
                        case 9:
                            if (experiencia.xp >= 8000) {
                                let newLvl = nivel.lvl + 1
                                updateLvl.run(newLvl, userId)
                            } else {

                                let newXp = experiencia.xp + 15
                                updateXp.run(newXp, userId)
                            }
                            break;
                        case 10:
                            if (experiencia.xp >= 10000) {
                                let newLvl = nivel.lvl + 1
                                updateLvl.run(newLvl, userId)
                            } else {

                                let newXp = experiencia.xp + 15
                                updateXp.run(newXp, userId)
                            }
                            break;

                        default:
                            break;
                    }

                } else {
                    console.error('Erro ao registrar usuário:', error);
                }
            }
        }
    }
}