const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js")
const db = require('../../db')
const Canvas = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rankq')
        .setDescription('Consultar seu Nível e quantidade de XP'),

}

// Cria a tabela de XP se não existir
db.run(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT, xp INTEGER, level INTEGER)`);

// Função para adicionar XP ao usuário e atualizar o nível
function addXP(userId, username, amount) {
  db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, row) => {
    if (err) return console.error(err.message);

    if (!row) {
      // Usuário novo no banco
      db.run(`INSERT INTO users (id, username, xp, level) VALUES (?, ?, ?, ?)`, [userId, username, amount, 1]);
    } else {
      // Atualiza o XP e verifica o nível
      let newXP = row.xp + amount;
      let newLevel = row.level;

      // Cada nível requer 500 XP
      while (newXP >= newLevel * 500) {
        newXP -= newLevel * 500;
        newLevel++;
      }

      db.run(`UPDATE users SET xp = ?, level = ? WHERE id = ?`, [newXP, newLevel, userId]);
    }
  });
}

// Função para obter os dados de um usuário específico
function getUserData(userId, callback) {
  db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, row) => {
    if (err) return console.error(err.message);
    callback(row);
  });
}


// Evento para comandos de barra
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    const { commandName } = interaction;
  
    if (commandName === 'rank') {
      // Obtém os dados do usuário que executou o comando
      getUserData(interaction.user.id, async (userData) => {
        if (!userData) {
          return interaction.reply("Você ainda não possui XP registrado.");
        }
  
        // Configura o Canvas para criar o card de XP
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');
  
        // Fundo do card
        context.fillStyle = '#2f3237';
        context.fillRect(0, 0, canvas.width, canvas.height);
  
        // Foto de perfil do usuário
        const avatar = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'jpg' }));
        context.save();
        context.beginPath();
        context.arc(125, 125, 50, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        context.drawImage(avatar, 75, 75, 100, 100);
        context.restore();
  
        // Nome do usuário
        context.fillStyle = '#ffffff';
        context.font = '28px Arial';
        context.fillText(interaction.user.username, 200, 100);
  
        // Nível e Classificação
        context.font = '22px Arial';
        context.fillStyle = '#ffffffaa';
        context.fillText('NÍVEL', 200, 140);
        context.fillStyle = '#00b8ff';
        context.fillText(`${userData.level}`, 280, 140);
  
        // Barra de XP
        const requiredXP = userData.level * 500;
        const xpPercentage = (userData.xp / requiredXP) * 100;
  
        context.fillStyle = '#3d3f43';
        context.fillRect(200, 170, 400, 20);
        context.fillStyle = '#00b8ff';
        context.fillRect(200, 170, 4 * xpPercentage, 20); // Progresso do XP (com base na porcentagem)
  
        // Texto de XP
        context.font = '18px Arial';
        context.fillStyle = '#ffffffaa';
        context.fillText(`${userData.xp} / ${requiredXP} XP`, 200, 210);
  
        // Enviar o card como um anexo no Discord
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'rank-card.png' });
        interaction.reply({ files: [attachment] });
      });
    }
  });
  
  // Adiciona XP ao usuário ao enviar mensagens (opcional)
  client.on('messageCreate', message => {
    if (!message.author.bot) {
      addXP(message.author.id, message.author.username, 10);
    }
  });