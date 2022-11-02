import fs from 'node:fs'
import path from 'node:path'
import sqlite3 from 'sqlite3'


export const parseWordsFromDb = () => {
  const db = new sqlite3.Database(path.join(__dirname, 'db.sqlite3'))
  const isDbExists = fs.existsSync(path.join(__dirname, 'db.sqlite3'))

  let result: any

  if (!isDbExists) {
    result = []
  }

  result = db.run('SELECT word FROM wordle')
  db.close()

  return result
}

