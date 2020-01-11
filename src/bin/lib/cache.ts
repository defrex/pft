import { resolve } from 'path'
import { exists, readFile, writeFile, mkdir } from 'fs'

const cacheDir = `${__dirname}/../../../.cache/transactions`

export function cacheFilename(
  plaidFiToken: string,
  startDate: string,
  endDate: string,
  page: number,
) {
  return resolve(
    `${cacheDir}/${plaidFiToken}-${startDate}-${endDate}-${page}.json`,
  )
}

export async function readCache<T>(
  plaidFiToken: string,
  startDate: string,
  endDate: string,
  page: number,
): Promise<T | void> {
  const filename = cacheFilename(plaidFiToken, startDate, endDate, page)
  return new Promise((resolve, reject) => {
    exists(filename, (doesExist) => {
      if (!doesExist) {
        resolve()
      }
      readFile(filename, (err, data: Buffer) => {
        if (err) {
          reject(err)
        } else {
          resolve(JSON.parse(data.toString('utf-8')))
        }
      })
    })
  })
}

export async function writeCache(
  plaidFiToken: string,
  startDate: string,
  endDate: string,
  page: number,
  data: any,
): Promise<void> {
  const filename = cacheFilename(plaidFiToken, startDate, endDate, page)
  return new Promise((resolve, reject) => {
    mkdir(cacheDir, { recursive: true }, () => {
      writeFile(filename, JSON.stringify(data), (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  })
}
