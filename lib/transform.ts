import { Transaction } from './Transaction'
import { SpreadsheetUpdate } from './SpreadsheetUpdate'

export function transactionsToUpdates(transactions: Transaction[]) {
  const updates: SpreadsheetUpdate[] = transactions.map((transaction, i) => {
    return {
      range: `A${i + 2}:C${i + 2}`,
      values: [
        [
          transaction.name,
          transaction.date.toISOString(),
          transaction.amount.toString(),
        ],
      ],
    } as SpreadsheetUpdate
  })

  updates.push({
    range: `A1:C1`,
    values: [['Name', 'Date', 'Amount']],
  })

  return updates
}
