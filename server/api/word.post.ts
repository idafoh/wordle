import fs from 'node:fs'
import sqlite3 from 'sqlite3'

import { dbPath } from './db.get'

export default defineEventHandler(async (event) => {
  const { word, score = 0 } = await readBody(event)

  if (!word || word?.length !== 5) {
    return {
      ok: false,
      code: !word ? 17 : 3,
      message: !word ? 'No word provided' : 'Word length must be 5 chars long'
    }
  }

  if (score < 0 || score > 1) {
    return {
      ok: false,
      code: 4,
      message: 'Score must be between 0 and 1'
    }
  }

  const db = new sqlite3.Database(dbPath)
  const isDbExists = fs.existsSync(dbPath)

  // promisify query
  const query = (sql: string, params?: any) => new Promise<null>((resolve, reject) => {
    db.run(sql, params, error => {
      if (error) {
        reject(error)
      } else {
        resolve(null)
      }
    })
  })

  // if no db it'll generates root project folder (to avoid unexpected errors)
  if (!isDbExists) {
    await query(`
      CREATE TABLE IF NOT EXISTS wordle (
        id INTEGER PRIMARY KEY,
        word TEXT NOT NULL,
        score REAL DEFAULT 0
      )
    `)

    await query(`CREATE UNIQUE INDEX idx_word ON wordle (word)`)
  }

  try {
    await query(`INSERT INTO wordle (word, score) VALUES (?, ?)`, [word, score])

    db.close()
  } catch (error) {
    db.close()

    return {
      ok: false,
      code: 19,
      message: 'Duplicate word'
    }
  }


  return {
    ok: true,
    code: 0,
    message: 'Word added to db, thanks'
  }
})
