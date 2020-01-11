import { TransactionSet } from './TransactionSet'
import { Transaction } from './Transaction'
import { findSubscriptions } from './findSubscriptions'

export interface DataTransaction {
  name: string
  date: Date
  amount: number
  accountId: string
  category: string[]
}

export interface Data {
  lastRun: Date
  months: {
    start: Date
    sum: number
    transactions: DataTransaction[]
  }[]
  subscriptions: {
    sum: number
    transactions: DataTransaction[]
  }
}

function toDataTransaction(transaction: Transaction): DataTransaction {
  return {
    name: transaction.name,
    date: transaction.date.toDate(),
    amount: transaction.amount,
    accountId: transaction.accountId,
    category: transaction.category,
  }
}

export async function processTransactions(
  transactions: TransactionSet,
): Promise<Data> {
  const subscriptions = findSubscriptions(transactions)
  return {
    lastRun: new Date(),
    subscriptions: {
      sum: subscriptions.sum(),
      transactions: subscriptions.map(toDataTransaction),
    },
    months: transactions.mapMonths((month, transactions) => ({
      start: month.toDate(),
      sum: transactions.sum(),
      transactions: transactions.map(toDataTransaction),
    })),
  }
}
