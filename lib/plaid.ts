import { Client, environments, Account } from 'plaid'

export const plaidFiTokens: string[] = Object.keys(process.env)
  .filter((key) => key.startsWith('PLAID_TOKEN'))
  .map((key) => process.env[key]!)

export const plaidAccountIds: string[] = JSON.parse(
  process.env.PLAID_ACCOUNTS || '[]',
)

export const plaid = new Client(
  process.env.PLAID_CLIENT_ID!,
  process.env.PLAID_SECRET!,
  process.env.PLAID_PUBLIC_KEY!,
  environments.development,
  {
    version: '2018-05-22',
  },
)

let plaidAccounts: { [key: string]: Account } | null = null
export async function getPlaidAccounts(): Promise<{ [key: string]: Account }> {
  if (plaidAccounts === null) {
    plaidAccounts = {}
    for (const plaidFiToken of plaidFiTokens) {
      const { accounts } = await plaid.getAccounts(plaidFiToken)
      for (const account of accounts) {
        plaidAccounts[account.account_id] = account
      }
    }
  }
  return plaidAccounts
}
