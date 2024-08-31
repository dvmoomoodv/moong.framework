import { fetch } from 'ofetch'
import { Ustra } from '../ustra'

export class UstraFetch {
  constructor(private $ustra: Ustra) {}

  /**
   * fetch 이후 데이터의 text를 reading
   * @param requestInfo
   * @returns
   */
  readText(requestInfo: globalThis.RequestInfo) {
    return fetch(requestInfo).then(async res => {
      return await res.text()
    })
  }
}
