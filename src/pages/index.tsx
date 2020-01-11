import { graphql } from 'gatsby'
import React from 'react'
import { IndexPageQuery } from '../../gen/typeDefs'
import { Page } from '../components/Page'

export const query = graphql`
  query IndexPage {
    dataJson {
      months {
        start
        sum
      }
    }
  }
`

interface IndexPageProps {
  data: IndexPageQuery
}

export default function IndexPage({ data }: IndexPageProps) {
  return (
    <Page>
      <h3>Months</h3>
      <ul>
        {data.dataJson.months.map((month, index) => (
          <li key={index}>
            {month.start}: {month.sum}
          </li>
        ))}
      </ul>
    </Page>
  )
}
