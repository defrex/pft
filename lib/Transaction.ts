import { Account } from 'plaid'

export interface Transaction {
  plaidAccount: Account
  plaidAccountId: string
  name: string
  date: string
  amount: number
  category: string[]
  isTransfer: boolean
}
