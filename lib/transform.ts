import { Transaction } from './Transaction'
import { SpreadsheetUpdate } from './SpreadsheetUpdate'

export function transactionsToUpdates(transactions: Transaction[]) {
  let updates: SpreadsheetUpdate[] = []

  updates.push({
    range: `A1:F1`,
    values: [['Category', 'Account', 'Date', 'Name', 'Amount', 'Transfer']],
  })
  transactions.forEach((transaction, index) => {
    updates.push({
      range: `A${index + 2}:F${index + 2}`,
      values: [
        [
          transaction.category.join(' > '),
          transaction.plaidAccount.official_name,
          transaction.date,
          transaction.name,
          transaction.amount.toString(),
          transaction.isTransfer ? 'true' : '',
        ],
      ],
    })
  })

  updates.push({
    range: `I1:J1`,
    values: [['Month', 'Sum']],
  })
  const months: { [key: string]: Transaction[] } = {}
  for (const transaction of transactions) {
    if (transaction.isTransfer) {
      continue
    }
    const month = transaction.date
      .split('-')
      .slice(0, 2)
      .join('-')
    months[month] = months[month] || []
    months[month].push(transaction)
  }
  Object.entries(months).forEach(([month, transactions], index) => {
    const sum = transactions.reduce((sum, { amount }) => sum + amount, 0)
    updates.push({
      range: `I${index + 2}:J${index + 2}`,
      values: [[month, sum]],
    })
  })

  return updates
}
