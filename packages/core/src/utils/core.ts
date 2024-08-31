/**
 * Core 유틸리티
 * @packageDocumentation
 */
import mergeWith from 'lodash/mergeWith'
import isArray from 'lodash/isArray'
import objectUtils from './objects'
import { CancelablePromise } from '../types'

export class Core {
  /**
   * 플랫폼에 맞는 global 객체 조회
   */
  get global(): any {
    if (typeof self !== 'undefined') {
      return self
    }
    if (typeof window !== 'undefined') {
      return window
    }
    if (typeof global !== 'undefined') {
      return global
    }
    throw new Error('unable to locate global object')
  }

  /**
   * Assign objects
   * @param args
   * @returns
   */
  assign<T>(...args: T[] | Partial<T>[]): T {
    return Object.assign.apply(Object, [{}, ...args])
  }

  /**
   * deepmerge objects
   * @param object {<T>} object
   * @param source {<T>} source
   */
  deepMerge<T>(object: T | Partial<T>, ...sources: T[] | Partial<T>[]): T {
    let tempObj = object

    sources.forEach(source => {
      tempObj = mergeWith(object, source, (a, b) => {
        if (isArray(b)) {
          return b
        }
      })
    })

    return tempObj as T
  }

  /**
   * deepmerge objects and array concat action
   * @param object {<T>} object
   * @param source {<T>} source
   */
  deepMergeArrayConcat<T>(object: T | Partial<T>, ...sources: T[] | Partial<T>[]): T {
    let tempObj = object

    sources.forEach(source => {
      tempObj = mergeWith(object, source, (a, b) => {
        if (isArray(a)) {
          return a.concat(b)
        }
      })
    })

    return tempObj as T
  }

  /**
   * deepmerge objects (when object value is ignore null value object)
   * @param object object
   * @param sources target sources
   */
  deepMergeWithNull<T>(object: T | Partial<T>, ...sources: T[] | Partial<T>[]): T {
    let tempObj = object

    sources.forEach(source => {
      tempObj = mergeWith(object, source, (a, b) => (b === null ? a : undefined))
    })

    return tempObj as T
  }

  /**
   * object의 function을 제거한다.
   * @param object
   */
  removeFunction = (obj: object, depth: number = 1): object => {
    if (!obj || depth > 20) {
      return obj
    }
    Object.keys(obj).forEach(k => {
      if (typeof obj[k] === 'function') {
        delete obj[k]
      } else if (Array.isArray(obj[k])) {
        obj[k] = obj[k].filter(item => typeof item !== 'function')

        obj[k].forEach(v => {
          if (typeof v === 'object') {
            this.removeFunction(v, ++depth)
          }
        })
      } else if (typeof obj[k] === 'object') {
        this.removeFunction(obj[k], ++depth)
      }
    })

    return obj
  }

  /**
   * 특정 value에 해당하는 object key 반환
   * @param obj object
   * @param val val
   */
  getObjectKey(obj: object, val: any): string {
    if (!obj) {
      return null
    }

    for (const enumKey of Object.keys(obj)) {
      if (obj[enumKey] === val) {
        return enumKey as string
      }
    }

    return null
  }

  /**
   * 지정된 ms 기준 지연 처리
   * @param ms
   */
  sleep(ms: number = 0): CancelablePromise<void> {
    let timer = null
    return new CancelablePromise(
      resolve => {
        timer = setTimeout(resolve, ms)
      },
      () => {
        if (timer) {
          clearTimeout(timer)
        }
      },
    )
  }

  /**
   * value 값이 null 또는 undefined일 경우, default 값 반환
   * @param value 대상 값
   * @param defaultValue 기본 값
   */
  defaults<T>(value: T, defaultValue: T): T {
    if (typeof value === 'undefined' || value === null) {
      return defaultValue
    }

    return value
  }

  /**
   * 객체의 empty 여부를 조사
   * @param obj object
   */
  isEmpty(obj: any) {
    return typeof obj === 'undefined' || obj === null || obj === ''
  }

  /**
   * 객체를 비동기로 조회
   *  비동기로 로드되는 객체가 인식될 때까지 대기하여 객체를 조회
   * @param objectFn 객체 조회 function
   * @param timeout  최대 대기 ms (0일 경우 무제한) @default 0
   */
  getObjectAsync = <T>(objectFn: () => T, timeout = 0): Promise<T> => {
    if (!objectFn) {
      return Promise.resolve(null)
    }

    return new Promise(resolve => {
      let timer = objectUtils.getProperty(objectFn, 'timer')
      if (timeout > 0 && !timer) {
        timer = setTimeout(() => {
          const resolved = objectUtils.getProperty(objectFn, 'resolved')

          if (resolved) {
            return
          }
          objectUtils.setProperty(objectFn, 'resolved', true)
          objectUtils.deleteProperty(objectFn, 'timer')
          resolve(null)
        }, timeout)
      }

      const getObject = () => {
        const obj = objectFn()

        if (obj) {
          const resolved = objectUtils.getProperty(objectFn, 'resolved')

          if (resolved) {
            return
          }

          objectUtils.setProperty(objectFn, 'resolved', true)

          const timer = objectUtils.getProperty(objectFn, 'timer')
          if (timer) {
            clearTimeout(timer)
          }

          objectUtils.deleteProperty(objectFn, 'timer')
          resolve(obj)
        } else {
          setTimeout(() => getObject(), 50)
        }
      }

      getObject()
    })
  }

  private noopFn: any = (_: any) => _

  /**
   * 객체의 proxy를 생성
   * @param target 대상
   * @param key 키 값
   * @param getter or setter
   */
  proxy(target: any, key: string, { get, set }: { get?: Function; set?: Function }) {
    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,
      get: get || this.noopFn,
      set: set || this.noopFn,
    })
  }

  /**
   * 객체를 depp freezing 처리한다.
   * @param T 객체 유형
   * @param o 객체
   * @returns deep freezed object
   */
  deepFreez<T>(o: T) {
    Object.freeze(o)
    if (o === undefined) {
      return o
    }

    Object.getOwnPropertyNames(o).forEach(function (prop) {
      if (o[prop] !== null && (typeof o[prop] === 'object' || typeof o[prop] === 'function') && !Object.isFrozen(o[prop])) {
        // @ts-ignore
        this.deepFreeze(o[prop])
      }
    })

    return o
  }

  /**
   * object를 clone
   * @param obj
   */
  clone<T>(obj: T) {
    if (Array.isArray(obj)) {
      // @ts-ignore
      return this.deepMerge([], obj)
    }

    return this.deepMerge({}, obj)
  }

  /**
   * Iterate over an Array or an Object invoking a function for each item.
   *
   * If `obj` is an Array callback will be called passing
   * the value, index, and complete array for each item.
   *
   * If 'obj' is an Object callback will be called passing
   * the value, key, and complete object for each property.
   *
   * @param {Object|Array} obj The object to iterate
   * @param {Function} fn The callback to invoke for each item
   */
  forEach(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return
    }

    // Force an array if not already something iterable
    if (typeof obj !== 'object' && !isArray(obj)) {
      /*eslint no-param-reassign:0*/
      obj = [obj]
    }

    if (isArray(obj)) {
      // Iterate over array values
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj)
      }
    } else {
      // Iterate over object keys
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj)
        }
      }
    }
  }
}

/**
 * core utility
 */
const instance = new Core()
export default instance
