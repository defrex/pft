import { Client, environments } from 'plaid'

export const plaid = new Client(
  process.env.PLAID_CLIENT_ID!,
  process.env.PLAID_SECRET!,
  process.env.PLAID_PUBLIC_KEY!,
  environments.development,
  {
    version: '2018-05-22',
  },
)
