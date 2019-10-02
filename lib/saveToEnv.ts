import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

const envPath = path.resolve(__dirname, '../.env')

export function saveToEnv(vars: { [key: string]: string }) {
  let current: { [key: string]: string }
  try {
    current = dotenv.parse(fs.readFileSync(envPath))
  } catch (e) {
    current = {}
  }
  Object.assign(current, vars)
  const serlized = Object.entries(current)
    .map(([key, value]) => `${key}=${value}`)
    .join(`\n`)
  fs.writeFileSync(envPath, serlized)
}
