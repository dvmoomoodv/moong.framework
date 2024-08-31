/**
 * network 관련 유틸리티
 * @exports {@link File}
 * @exports {@link instance}
 * @packageDocumentation
 */

import fs from 'node:fs'
import https from 'node:https'
import http from 'node:http'

export class Net {
  /**
   * web Url 경로의 파일을 다운로드 한다.
   * @param url 원격지 URL
   * @param targetPath 대상 경로
   */
  downloadWebFile(url: string, targetPath: string) {
    return new Promise<void>((resolve, reject) => {
      if (url.startsWith('https')) {
        https.get(url, res => {
          const filePath = fs.createWriteStream(targetPath)
          res.pipe(filePath)
          filePath
            .on('finish', () => {
              filePath.close()
              resolve()
            })
            .on('error', err => reject(err))
        })
      } else {
        http.get(url, res => {
          const filePath = fs.createWriteStream(targetPath)
          res.pipe(filePath)
          filePath
            .on('finish', () => {
              filePath.close()
              resolve()
            })
            .on('error', err => reject(err))
        })
      }
    })
  }
}

const instance = new Net()
export default instance
