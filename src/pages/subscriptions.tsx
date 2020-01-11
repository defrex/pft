import { graphql } from 'gatsby'
import React from 'react'
import { SubscriptionsPageQuery } from '../../gen/typeDefs'
import { Page } from '../components/Page'

export const query = graphql`
  query SubscriptionsPage {
    dataJson {
      subscriptions {
        sum
      }
    }
  }
`

interface SubscriptionsPageProps {
  data: SubscriptionsPageQuery
}

export default function SubscriptionsPage({ data }: SubscriptionsPageProps) {
  return (
    <Page>
      <h3>Subscriptions</h3>
      {data.dataJson.subscriptions.sum}
    </Page>
  )
}
