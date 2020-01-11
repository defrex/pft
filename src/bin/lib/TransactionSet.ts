import moment, { Moment } from 'moment'
import { Account as PlaidAccount, Transaction as PlaidTransaction } from 'plaid'
import { Transaction } from './Transaction'

export class TransactionSet {
  transactions: Transaction[]
  accounts: PlaidAccount[]
  transferIds: string[] = []
  _months: Map<number, Transaction[]> | null = null

  constructor(
    plaidTransactions: PlaidTransaction[] | Transaction[],
    plaidAccounts: PlaidAccount[],
  ) {
    this.accounts = plaidAccounts
    if (
      plaidTransactions.length &&
      plaidTransactions[0] instanceof Transaction
    ) {
      this.transactions = plaidTransactions as Transaction[]
    } else {
      this.transactions = (plaidTransactions as PlaidTransaction[]).map(
        (plaidTransaction) => {
          const plaidAccount = plaidAccounts.find(
            ({ account_id }) => account_id === plaidTransaction.account_id,
          )
          if (!plaidAccount) {
            throw new Error(
              `Cannot find account for ID ${plaidTransaction.account_id}`,
            )
          }
          return new Transaction(plaidTransaction, plaidAccount)
        },
      )
      this.transactions.forEach((transaction) => {
        const inverse = this.transactions.find(
          (inverseTransaction) =>
            -(inverseTransaction.amount || 0) == transaction.amount &&
            inverseTransaction.accountId !== transaction.accountId,
        )
        if (inverse) {
          transaction.setTransfer(inverse)
          inverse.setTransfer(transaction)
        }
      })
    }
    this.transactions.sort((t1, t2) => t2.date.valueOf() - t1.date.valueOf())
  }

  get length() {
    return this.transactions.length
  }

  get months(): Map<number, Transaction[]> {
    if (this._months === null) {
      this._months = new Map<number, Transaction[]>()
      for (const transaction of this.transactions) {
        const month = transaction.date.startOf('month').valueOf()
        if (!this._months.has(month)) {
          this._months.set(month, [])
        }
        this._months.get(month)!.push(transaction)
      }
    }
    return this._months
  }

  account(id: string): PlaidAccount | undefined {
    return this.accounts.find(({ account_id }) => account_id === id)
  }

  sum(): number {
    return this.transactions.reduce((sum, { amount }) => sum + amount, 0)
  }

  last() {
    return this.transactions[0]
  }

  first() {
    return this.transactions[this.transactions.length - 1]
  }

  map<T>(iterator: (value: Transaction, index: number) => T): T[] {
    return this.transactions.map(iterator)
  }

  mapMonths<T>(
    iterator: (month: Moment, transactions: TransactionSet, index: number) => T,
  ): T[] {
    let index = 0
    const results: T[] = []
    this.months.forEach((transactions, month) => {
      results.push(
        iterator(
          moment(month),
          new TransactionSet(transactions, this.accounts),
          index,
        ),
      )
      index++
    })
    return results
  }
}
