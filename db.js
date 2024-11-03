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


  module.exports = db;