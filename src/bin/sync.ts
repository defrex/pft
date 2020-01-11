require('dotenv').config()

import { fetchTransactions } from './lib/fetchTransactions'
import { processTransactions } from './lib/processTransactions'
import { saveData } from './lib/saveData'

async function main() {
  const transactions = await fetchTransactions()
  const data = await processTransactions(transactions)
  await saveData(data)
}

main()
