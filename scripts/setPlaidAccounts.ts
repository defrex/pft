require('dotenv').config()

import { saveToEnv } from '../lib/saveToEnv'
// @ts-ignore
import multiselect from 'multiselect-prompt'
import { plaid, plaidFiTokens } from '../lib/plaid'

async function main() {
  for (const plaidFiToken of plaidFiTokens) {
    const { accounts } = await plaid.getAccounts(plaidFiToken)

    multiselect(
      'Which accounts would you like to sync?',
      accounts.map((account) => ({
        title: account.official_name || account.name,
        value: account.account_id,
      })),
    ).on('submit', (items: { selected: boolean }[]) => {
      let selectedAccounts: string[] = []
      items.forEach(({ selected }, index) => {
        if (selected) {
          selectedAccounts.push(accounts[index].account_id)
        }
      })
      saveToEnv({
        PLAID_ACCOUNTS: JSON.stringify(selectedAccounts),
      })
    })
  }
}
main()
