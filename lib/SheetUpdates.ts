import { sheets_v4 } from 'googleapis'

type Update = sheets_v4.Schema$ValueRange
type Sheet = 'Transactions' | 'Summary' | 'Subscriptions'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export class SheetUpdates {
  updates: Update[] = []

  write(sheet: Sheet, startCol: string, startRow: number, data: string[][]) {
    const endCol = alphabet[alphabet.indexOf(startCol) + data[0].length - 1]
    const endRow = startRow + data.length - 1
    this.updates.push({
      range: `${sheet}!${startCol}${startRow}:${endCol}${endRow}`,
      values: data,
    })
  }

  writeRow(sheet: Sheet, startCol: string, row: number, data: string[]) {
    this.write(sheet, startCol, row, [data])
  }

  result() {
    return this.updates
  }
}
