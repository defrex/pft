require('dotenv').config()

import { saveToEnv } from './lib/saveToEnv'
// @ts-ignore
import multiselect from 'multiselect-prompt'
import { plaid, plaidFiTokens } from './lib/plaid'

async function main() {
  let selectedAccounts: string[] = []

  for (const plaidFiToken of plaidFiTokens) {
    const { accounts } = await plaid.getAccounts(plaidFiToken)

    await new Promise((resolve, reject) => {
      multiselect(
        'Which accounts would you like to sync?',
        accounts.map((account) => ({
          title: account.official_name || account.name,
          value: account.account_id,
        })),
      ).on('submit', (items: { selected: boolean }[]) => {
        items.forEach(({ selected }, index) => {
          if (selected) {
            selectedAccounts.push(accounts[index].account_id)
          }
        })
        resolve()
      })
    })
  }

  saveToEnv({
    PLAID_ACCOUNTS: JSON.stringify(selectedAccounts),
  })
}
main()
