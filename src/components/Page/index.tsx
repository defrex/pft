import { graphql, useStaticQuery, Link } from 'gatsby'
import React, { ReactNode } from 'react'
import { PageQuery } from '../../../gen/typeDefs'
import styles from './styles.module.scss'
import moment from 'moment'

interface PageProps {
  children: ReactNode
}

export function Page({ children }: PageProps) {
  const data = useStaticQuery<PageQuery>(graphql`
    query Page {
      site {
        siteMetadata {
          title
        }
      }
      dataJson {
        lastRun
      }
    }
  `)

  return (
    <div>
      <header className={styles.header}>
        <div>{data.site.siteMetadata.title}</div>
        <div className={styles.expand} />
        <div>
          {'Updated '}
          {moment(data.dataJson.lastRun).format('MMM Do')}
        </div>
      </header>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navItem}>
          Months
        </Link>
        <Link to="/subscriptions" className={styles.navItem}>
          Subscriptions
        </Link>
      </nav>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div>
          ©{new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </div>
      </footer>
    </div>
  )
}
