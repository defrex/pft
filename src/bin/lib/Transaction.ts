import { Transaction as PlaidTransaction, Account as PlaidAccount } from 'plaid'
import moment from 'moment'

export class Transaction {
  plaidTransaction: PlaidTransaction
  plaidAccount: PlaidAccount
  transfer: Transaction | null = null

  constructor(plaidTransaction: PlaidTransaction, account: PlaidAccount) {
    this.plaidTransaction = plaidTransaction
    this.plaidAccount = account
  }

  get name(): string {
    return this.plaidTransaction.name || this.plaidTransaction.transaction_id
  }

  get date(): moment.Moment {
    return moment(this.plaidTransaction.date)
  }

  get amount(): number {
    return -(this.plaidTransaction.amount || 0)
  }

  get accountId(): string {
    return this.plaidTransaction.account_id
  }

  get category(): string[] {
    return this.plaidTransaction.category || ['Unknown']
  }

  get isTransfer(): boolean {
    return this.transfer !== null
  }

  setTransfer(inverse: Transaction) {
    this.transfer = inverse
  }
}
