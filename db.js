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

  module.exports = db;