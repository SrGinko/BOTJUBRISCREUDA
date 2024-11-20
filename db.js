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

db.prepare(`CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY,
  filename TEXT,
  filetype TEXT,
  content BLOB
)`).run()

db.prepare(`CREATE TABLE IF NOT EXISTS personagem (
  id INTEGER PRIMARY KEY,
  nomePersonagem TEXT,
  classePersonagem TEXT,
  vidaPersonagem INTEGER,
  danoPersonagem INTEGER
)`).run()

  module.exports = db;