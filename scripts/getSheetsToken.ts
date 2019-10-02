require('dotenv').config()

import readline from 'readline'
import { oAuth2Client } from '../lib/googleClient'
import { saveToEnv } from '../lib/saveToEnv'
import { fromEntries } from 'lib/fromEntries'

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/spreadsheets'],
})

console.log('Authorize Google Sheets by visiting this url:', authUrl)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('Enter the code from that page here: ', async (code) => {
  rl.close()
  const { tokens } = await oAuth2Client.getToken(code)

  const vars = fromEntries(
    Object.entries(tokens).map(([key, value]) => [
      `SHEETS_${key.toUpperCase()}`,
      value,
    ]),
  )

  saveToEnv(vars)
  console.log(`Token stored in .env.`)
})
