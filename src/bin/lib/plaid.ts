import { Client, environments } from 'plaid'

if (
  !process.env.PLAID_CLIENT_ID ||
  !process.env.PLAID_SECRET ||
  !process.env.PLAID_PUBLIC_KEY
) {
  throw new Error('Missing Plaid ENV vars')
}

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
)
