import { SheetUpdates } from './SheetUpdates'
import { TransactionSet } from './TransactionSet'

export function transactionsToUpdates(transactions: TransactionSet) {
  const updates = new SheetUpdates()

  updates.writeRow('Transactions', 'A', 1, [
    'Account',
    'Date',
    'Name',
    'Amount',
    'Transfer',
  ])
  transactions.forEach((transaction, index) => {
    updates.writeRow('Transactions', 'A', index + 2, [
      transaction.plaidAccount.official_name || '',
      transaction.date.format('YYYY-MM-DD'),
      transaction.name,
      transaction.amount.toString(),
      transaction.isTransfer ? 'true' : '',
    ])
  })
  updates.write(
    'Transactions',
    'A',
    transactions.length + 2,
    new Array(500).fill(new Array(5).fill('')),
  )

  updates.writeRow('Subscriptions', 'A', 1, ['Name', 'Amount', 'Category'])
  const subscriptions = transactions.findSubscriptions()
  console.log(`${subscriptions.length} subscriptions found`)
  subscriptions.forEach((transaction, index) => {
    updates.writeRow('Subscriptions', 'A', index + 2, [
      transaction.name,
      transaction.amount.toString(),
      transaction.category.join(' > '),
    ])
  })
  updates.write(
    'Subscriptions',
    'A',
    subscriptions.length + 2,
    new Array(500).fill(new Array(3).fill('')),
  )
  // console.log(JSON.stringify(updates.result(), null, 2))

  updates.writeRow('Summary', 'A', 1, ['Month', 'Sum'])
  transactions.forEachMonth((month, transactions, index) => {
    updates.writeRow('Summary', 'A', index + 2, [
      month.format('YYYY-MM-DD'),
      transactions.sum().toString(),
    ])
  })

  updates.writeRow('Summary', 'D', 1, ['Subscriptions'])
  updates.writeRow('Summary', 'D', 2, [subscriptions.sum().toString()])

  return updates
}
