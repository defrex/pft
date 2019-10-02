import { Transaction } from './Transaction'

export function detectTransfers(transactions: Transaction[]): Transaction[] {
  return transactions.map((transaction) => {
    const inverse = transactions.find(
      ({ amount, plaidAccount }) =>
        -amount == transaction.amount &&
        plaidAccount.account_id !== transaction.plaidAccount.account_id,
    )
    if (inverse) {
      transaction.isTransfer = true
      inverse.isTransfer = true
    }
    return transaction
  })
}
