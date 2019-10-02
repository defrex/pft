require('dotenv').config()

import { fetchTransactions } from './lib/fetch'
import { transactionsToUpdates } from './lib/transform'
import { updateSheet } from './lib/update'

async function main() {
  const transactions = await fetchTransactions()
  const updates = transactionsToUpdates(transactions)
  updateSheet(updates)
}

main()
