import core from '../core'
import ObjectStorage from './object-storage'
import StringConverter from '../converter/string-converter'
import web from '../web'

/**
 storage for browser local stroage
 @packageDocumentation
 @browser
 */

export interface LocalStorageOption {
  /**
   * value converter
   */
  valueConverter?: StringConverter

  /**
   * key converter
   */
  keyConverter?: StringConverter
}

export default class LocalStorage extends ObjectStorage {
  protected option: LocalStorageOption = {
    // valueConverter: base64Converter,
  }

  constructor(option?: LocalStorageOption) {
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
    let value: any = window.localStorage.getItem(key)

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
    window.localStorage.setItem(key, value)
    super.addKey(key)
  }
  removeItem(key: string): void {
    if (!web.isBrowser) {
      return
    }

    key = this.getKey(key)
    window.localStorage.removeItem(key)
    super.removeKey(key)
  }

  private getKey(key: string) {
    if (this.option.keyConverter) {
      return this.option.keyConverter.convert(key)
    }

    return key
  }
}

export const localStorage = new LocalStorage()
