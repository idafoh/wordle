import fs from 'node:fs'
import path from 'node:path'
import { sendStream } from 'h3'

export const dbPath = path.join(process.cwd(), 'db.sqlite3')

export default defineEventHandler((event) => {
  return sendStream(event, fs.createReadStream(dbPath))
})
