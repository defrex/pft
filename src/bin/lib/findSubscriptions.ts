import { TransactionSet } from './TransactionSet'
import { Transaction } from './Transaction'
import moment = require('moment')

export function findSubscriptions(
  allTransactions: TransactionSet,
): TransactionSet {
  const subscriptions: Transaction[] = []
  const lastFullMonth = moment()
    .subtract(1, 'month')
    .startOf('month')
  const transactions = allTransactions.months.get(lastFullMonth.valueOf())
  if (!transactions) {
    console.warn('findSubscriptions: Not enough transactions for month 0 ⚠')
    return new TransactionSet([], allTransactions.accounts)
  }
  transactions: for (const transaction of transactions) {
    if (
      ['Food and Drink'].includes(transaction.category[0]) ||
      transaction.isTransfer ||
      transaction.amount > 0 ||
      transaction.name.includes('Uber')
    ) {
      continue
    }
    for (const monthsAgo of [1, 2, 3]) {
      const month = lastFullMonth.clone().subtract(monthsAgo, 'months')
      const monthTransactions = allTransactions.months.get(month.valueOf())
      if (!monthTransactions) {
        console.warn(
          `findSubscriptions: Not enough transactions for month ${monthsAgo} ⚠`,
        )
        return new TransactionSet([], allTransactions.accounts)
      }
      if (
        !monthTransactions.some((monthTransaction) => {
          return (
            monthTransaction.accountId === transaction.accountId &&
            monthTransaction.name === transaction.name &&
            (monthTransaction.amount <
              transaction.amount - transaction.amount * 0.1 ||
              monthTransaction.amount >
                transaction.amount + transaction.amount * 0.1)
          )
        })
      ) {
        continue transactions
      }
    }
    subscriptions.push(transaction)
  }
  return new TransactionSet(subscriptions, allTransactions.accounts)
}
