import { sheets } from './googleClient'
import { SpreadsheetUpdate } from './SpreadsheetUpdate'

export async function updateSheet(updates: SpreadsheetUpdate[]) {
  const response = await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: process.env.SHEETS_SHEET_ID,
    requestBody: {
      valueInputOption: `USER_ENTERED`,
      data: updates,
    },
  })
  console.log(`Success! ${response.data.totalUpdatedCells} cells updated.`)
}
