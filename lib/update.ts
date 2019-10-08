import { sheets } from './googleClient'
import { SheetUpdates } from './SheetUpdates'

export async function updateSheet(updates: SheetUpdates) {
  const response = await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: process.env.SHEETS_SHEET_ID,
    requestBody: {
      valueInputOption: `USER_ENTERED`,
      data: updates.result(),
    },
  })
  console.log(`Success! ${response.data.totalUpdatedCells} cells updated.`)
}
