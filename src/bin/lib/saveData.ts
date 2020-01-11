import { Data } from './processTransactions'
import { mkdir, writeFile } from 'fs'

const directory = `${__dirname}/../../data`
const filename = `${directory}/index.json`

export async function saveData(data: Data): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdir(directory, { recursive: true }, () => {
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
