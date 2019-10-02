import moment from 'moment'
import { plaid } from './plaidClient'
import { Transaction } from './Transaction'

const startDate = moment()
  .subtract(3, 'months')
  .startOf('month')
  .format('YYYY-MM-DD')
const endDate = moment().format('YYYY-MM-DD')

const plaidAccountTokens = Object.keys(process.env)
  .filter((key) => key.startsWith(`PLAID_TOKEN`))
  .map((key) => ({
    account: key.replace(/^PLAID_TOKEN_/, ''),
    token: process.env[key]!,
  }))

export async function fetchTransactions(): Promise<Transaction[]> {
  const rawTransactions = await Promise.all(
    plaidAccountTokens.map(({ account, token }) => {
      return plaid
        .getTransactions(token, startDate, endDate, {
          count: 250,
          offset: 0,
        })
        .then(({ transactions }) => ({
          account,
          transactions,
        }))
    }),
  )

  // concat all transactions
  return rawTransactions.reduce(
    (all, { account, transactions }) =>
      all.concat(
        transactions.map(({ name, date, amount, category }) => ({
          account,
          name: name ? name : 'Unknown',
          date: new Date(date),
          amount: amount ? -amount : 0,
          category: category ? category : [],
        })),
      ),
    [] as Transaction[],
  )
}

// export async function fetchBalances() {
//   const rawBalances = await Promise.all(
//     plaidAccountTokens.map(({ account, token }) => {
//       return plaid.getBalance(token)
//     }),
//   )

//   return rawBalances.reduce((all, { accounts }) => {
//     return all.concat(
//       accounts.map(({ name, balances }) => ({
//         name,
//         balance: balances.current,
//       })),
//     )
//   }, [])
// }
