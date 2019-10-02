import moment from 'moment'
import { Transaction as PlaidTransaction } from 'plaid'
import { detectTransfers } from './detectTransfers'
import {
  getPlaidAccounts,
  plaid,
  plaidAccountIds,
  plaidFiTokens,
} from './plaid'
import { Transaction } from './Transaction'

const startDate = moment()
  .subtract(6, 'months')
  .startOf('month')
  .format('YYYY-MM-DD')
const endDate = moment().format('YYYY-MM-DD')

async function fetchTransactionPage(
  page: number = 0,
): Promise<PlaidTransaction[]> {
  console.log(`Fetching transaction page ${page}`)
  let output: PlaidTransaction[] = []
  for (const plaidFiToken of plaidFiTokens) {
    const { transactions } = await plaid.getTransactions(
      plaidFiToken,
      startDate,
      endDate,
      { count: 500, offset: page * 500 },
    )
    output = output.concat(
      transactions.filter(({ account_id }) =>
        plaidAccountIds.includes(account_id),
      ),
    )
  }
  return output
}

export async function fetchTransactions(): Promise<Transaction[]> {
  if (plaidAccountIds.length === 0) {
    console.error(
      'No accounts selected. Please run `npm run set-plaid-accounts`.',
    )
    process.exit()
  }

  const plaidAccounts = await getPlaidAccounts()

  let transactions: Transaction[] = []
  let page = 0
  while (
    transactions.length === 0 ||
    moment(startDate).isBefore(
      moment(transactions[transactions.length - 1].date),
    )
  ) {
    const plaidTransactions = await fetchTransactionPage(page)
    transactions = transactions.concat(
      plaidTransactions.map(({ name, date, amount, category, account_id }) => ({
        plaidAccountId: account_id,
        plaidAccount: plaidAccounts[account_id],
        name: name ? name : 'Unknown',
        date: moment(date).format('YYYY-MM-DD'),
        amount: amount ? -amount : 0,
        category: category ? category : [],
        isTransfer: false,
      })),
    )
    page++
  }

  return detectTransfers(transactions)
}
