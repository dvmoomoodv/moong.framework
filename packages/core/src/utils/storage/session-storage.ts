import core from '../core'
import web from '../web'
import StringConverter from '../converter/string-converter'
import { base62Converter } from '../converter/base62-converter'
import ObjectStorage from './object-storage'

/**
 storage for browser local stroage
 @packageDocumentation
 @browser
 */

export interface SessionStorageOption {
  /**
   * value converter
   */
  valueConverter?: StringConverter

  /**
   * key converter
   */
  keyConverter?: StringConverter
}

export default class SessionStorage extends ObjectStorage {
  protected option: SessionStorageOption = {
    // valueConverter: base64Converter,
  }

  constructor(option?: SessionStorageOption) {
    super()

    if (option) {
      this.option = core.assign(this.option, option)
    }
  }

  getItem(key: string): any {
    if (!web.isBrowser) {
      return
    }

    key = this.getKey(key)
    let value: any = window.sessionStorage.getItem(key)

    if (this.option.valueConverter) {
      value = this.option.valueConverter.deconvert(value)
    }

    return this.deserializeValue(value)
  }

  setItem(key: string, value: any): void {
    if (!web.isBrowser) {
      return
    }

    key = this.getKey(key)
    value = this.serializeValue(value)

    if (this.option.valueConverter) {
      value = this.option.valueConverter.convert(value)
    }
    window.sessionStorage.setItem(key, value)
    super.addKey(key)
  }

  removeItem(key: string): void {
    if (!web.isBrowser) {
      return
    }

    key = this.getKey(key)
    window.sessionStorage.removeItem(key)
    super.removeKey(key)
  }

  private getKey(key: string) {
    if (this.option.keyConverter) {
      return this.option.keyConverter.convert(key)
    }

    return key
  }
}

export const sessionStorage = new SessionStorage()
export const base62SessionStorage = new SessionStorage({
  valueConverter: base62Converter,
})

export { ObjectStorage }
