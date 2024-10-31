const sqlite3 = require('better-sqlite3');
const db = sqlite3('./database.sqlite');


db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    xp INTEGER DEFAULT 0,
    lvl INTEGER DEFAULT 1
  )
`).run();

function addPoints(userId, xp, lvl) {
    const stmt = db.prepare('INSERT INTO users (id, points) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET points = points + ?');
    stmt.run(userId, username, xp, lvl );
  }

  function getPoints(userId) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(userId);
    return user 
  }

  module.exports = db;