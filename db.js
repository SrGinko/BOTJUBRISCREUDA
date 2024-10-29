const sqlite3 = require('better-sqlite3');
const db = sqlite3('./database.sqlite');

// Criação de uma tabela de exemplo
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT,
    points INTEGER DEFAULT 0
  )
`).run();

function addPoints(userId, points) {
    const stmt = db.prepare('INSERT INTO users (id, points) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET points = points + ?');
    stmt.run(userId, points, points);
  }

  function getPoints(userId) {
    const stmt = db.prepare('SELECT points FROM users WHERE id = ?');
    const user = stmt.get(userId);
    return user ? user.points : 0;
  }

  module.exports = db;