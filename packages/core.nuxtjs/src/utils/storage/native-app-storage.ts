import { NuxtApp } from '#app'
import ObjectStorage from '#ustra/core/utils/storage/object-storage'
import { localStorage } from '#ustra/core/utils/storage/local-storage'
import { base62Converter } from '#ustra/core/utils/converter/base62-converter'

// @ts-ignore
export default class NativeAppStorage extends ObjectStorage {
  constructor(private nuxtApp: NuxtApp, private bridgeName: string) {
    super()
    this.bridgeName = bridgeName
  }

  getItem(key: string, callback = null): any {
    return new Promise<any>(resolve => {
      if (this.nuxtApp.$ustra.mobile.isNativeRequest) {
        this.nuxtApp.$ustra.mobile.bridge.callNative({
          id: this.bridgeName,
          data: {
            type: '02',
            key,
          },
          callback: result => {
            const data = !result?.data?.value ? null : this.deserializeValue(base62Converter.deconvert(result.data.value))
            if (callback) {
              callback(data)
            }
            resolve(data)
          },
          callbackName: this.bridgeName.replace(/-/gi, '_') + '_' + key,
        })
      } else {
        const data = localStorage.getItem(key)

        if (callback) {
          callback(data)
        }
        resolve(data)
      }
    })
  }

  setItem(key: string, value: any) {
    localStorage.setItem(key, value)
    if (this.nuxtApp.$ustra.mobile.isNativeRequest) {
      this.nuxtApp.$ustra.mobile.bridge.callNative({
        id: this.bridgeName,
        data: {
          type: '01',
          key,
          value: base62Converter.convert(this.serializeValue(value)),
        },
      })
    }
  }

  removeItem(key: string = null) {
    localStorage.removeItem(key)
    if (this.nuxtApp.$ustra.mobile.isNativeRequest) {
      this.nuxtApp.$ustra.mobile.bridge.callNative({
        id: this.bridgeName,
        data: {
          type: '03',
          key,
        },
      })
    }
  }
}
