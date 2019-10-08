import moment from 'moment'
import { Account as PlaidAccount, Transaction as PlaidTransaction } from 'plaid'
import { readCache, writeCache } from './cache'
import { plaid, plaidAccountIds, plaidFiTokens } from './plaid'
import { TransactionSet } from './TransactionSet'

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
    const data = await readCache<PlaidTransaction[]>(
      plaidFiToken,
      startDate,
      endDate,
      page,
    )
    if (data) {
      output = output.concat(data)
    } else {
      const result = await plaid.getTransactions(
        plaidFiToken,
        startDate,
        endDate,
        { count: 500, offset: page * 500 },
      )
      const transactions = result.transactions.filter(({ account_id }) =>
        plaidAccountIds.includes(account_id),
      )
      await writeCache(plaidFiToken, startDate, endDate, page, transactions)
      output = output.concat(transactions)
    }
  }
  return output
}

export async function fetchTransactions(): Promise<TransactionSet> {
  if (plaidAccountIds.length === 0) {
    console.error(
      'No accounts selected. Please run `npm run set-plaid-accounts`.',
    )
    process.exit()
  }

  const plaidTransactions: PlaidTransaction[] = []
  const plaidAccounts: PlaidAccount[] = []

  for (const plaidFiToken of plaidFiTokens) {
    const { accounts } = await plaid.getAccounts(plaidFiToken)
    for (const account of accounts) {
      plaidAccounts.push(account)
    }
  }

  let page = 0
  while (
    plaidTransactions.length === 0 ||
    moment(startDate).isBefore(
      moment(plaidTransactions[plaidTransactions.length - 1].date),
    )
  ) {
    plaidTransactions.push(...(await fetchTransactionPage(page)))
    page++
  }

  return new TransactionSet(plaidTransactions, plaidAccounts)
}
