import { google } from 'googleapis'

const oAuth2Client = new google.auth.OAuth2(
  process.env.SHEETS_CLIENT_ID,
  process.env.SHEETS_CLIENT_SECRET,
  process.env.SHEETS_REDIRECT_URI,
)

oAuth2Client.setCredentials({
  access_token: process.env.SHEETS_ACCESS_TOKEN,
  refresh_token: process.env.SHEETS_REFRESH_TOKEN,
  // scope: process.env.SHEETS_SCOPE,
  token_type: process.env.SHEETS_TOKEN_TYPE,
  expiry_date: process.env.SHEETS_EXPIRY_DATE
    ? parseInt(process.env.SHEETS_EXPIRY_DATE, 10)
    : null,
})

export const sheets = google.sheets({
  version: 'v4',
  auth: oAuth2Client,
})
