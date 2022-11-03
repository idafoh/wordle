import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { sendStream } from 'h3'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
export const dbPath = path.resolve(__dirname, '..', '..', 'db.sqlite3')

export default defineEventHandler((event) => {
  useTrackEvent('download-db')

  return sendStream(event, fs.createReadStream(dbPath))
})
