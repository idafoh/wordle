import fs from 'node:fs'
import sqlite3 from 'sqlite3'

import { dbPath } from './db.get'


export default defineEventHandler(async () => {
  const db = new sqlite3.Database(dbPath)
  const isDbExists = fs.existsSync(dbPath)

  const result: string[] = []

  if (!isDbExists) {
    return result
  }

  const query = (sql: string) => new Promise<any>((resolve, reject) => {
    db.all(sql, (error, rows) => {
      if (error) {
        reject(error)
      } else {
        resolve(rows)
      }
    })
  })

  const rows = await query(`SELECT word AS w FROM wordle`)

  for (const { w } of rows) {
    result.push(w)
  }

  db.close()

  return result
})
