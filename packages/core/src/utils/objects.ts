/**
 * Object 유틸리티
 * @packageDocumentation
 */
// import omit from 'lodash/omit'

export class Objects {
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
   * @param enumObj object
   * @param enumVal val
   */
  getObjectKey(obj: object, _val: any): string {
    if (!obj) {
      return null
    }

    for (const enumKey of Object.keys(obj)) {
      if (obj[enumKey] === obj) {
        return enumKey as string
      }
    }

    return null
  }

  /**
   * object에 property 반영
   * @param obj opbject
   * @param propName property명
   * @param value property value
   */
  setProperty(obj: object | Function, propName: string, value: any): object {
    if (!obj) {
      return obj
    }

    obj[propName] = value
  }

  /**
   * object propety 조회
   * @param obj object
   * @param propName property 명
   */
  getProperty<T = any>(obj: object | Function, propName: string): T {
    if (!obj) {
      return null
    }
    return obj[propName] as T
  }

  /**
   * 프로퍼티를 경로로 추출
   * @param obj object or function
   * @param propPath property 경로
   * @returns
   * ```typescript
   * objects.getPropertyFromPath({ key1: { key11: 'a' }}, 'key1.key11')
   * ```
   */
  getPropertyFromPath(obj: object | Function, propPath: string) {
    if (!obj || !propPath) {
      return undefined
    }

    try {
      const splitedKeys = propPath.split('.')
      let tempObj = obj

      for (const propKey of splitedKeys) {
        if (!tempObj[propKey]) {
          return tempObj[propKey]
        }

        tempObj = tempObj[propKey]
      }

      return tempObj
    } catch (e) {
      return undefined
    }
  }

  /**
   * 프로퍼티 값을 경로 기반으로 추출
   * @param obj object | function
   * @param propPath property 경로
   * @param value 설정 값
   * @returns
   */
  setPropertyFromPath(obj: object | Function, propPath: string, value: any) {
    const paths = propPath.split('.')

    if (paths.length < 1) {
      return
    }

    let currentPath = ''
    for (let i = 0; i < paths.length; i++) {
      const preValue = !currentPath ? obj : this.getPropertyFromPath(obj, currentPath)

      currentPath += (i > 0 ? '.' : '') + paths[i]
      const pathValue = this.getPropertyFromPath(obj, currentPath)

      if (!pathValue) {
        preValue[paths[i]] = {}
      }

      if (i === paths.length - 1) {
        preValue[paths[i]] = value
      }
    }
  }

  /**
   * property를 제거한다.
   * @param _obj 대상 object
   * @param propPath 프로퍼티 경로 (ex:app.server)
   */
  deleteProperty(_obj: object | Function, propPath: string) {
    let objectStr = 'delete _obj'

    for (const propName of propPath.split('.')) {
      objectStr += `['${propName}']`
    }

    try {
      // eslint-disable-next-line no-eval
      eval(objectStr)
    } catch (e) {}
  }

  /**
   * 지정된 필드 명 제외 후 리턴
   * @param obj Object 객체
   * @param fieldNames 필드 목록
   */
  omit<T extends object>(obj: T, ...fieldNames: string[]): Partial<T> {
    for (const fieldName of fieldNames) {
      if (Object.hasOwn(obj, fieldName)) {
        delete obj[fieldName]
      }
    }

    return obj
  }

  /**
   * null  또는 undefined 객체를 제거
   * @param obj
   * @returns
   */
  excludeEmpty<T extends object>(obj: T): Partial<T> {
    const keys = Object.keys(obj)

    for (const key of keys) {
      if (obj[key] === null || obj[key] === undefined) {
        delete obj[key]
      }
    }

    return obj
  }

  /**
   * object를 flat한 구조로 변경
   * @param obj
   * @returns
   */
  flat<T extends object>(obj: T) {
    let result = {} as T

    for (const i in obj) {
      if (typeof obj[i] === 'object' && !Array.isArray(obj[i])) {
        const temp = this.flat(obj[i] as object)
        for (const j in temp) {
          result[i + '.' + j] = temp[j]
        }
      } else {
        result[i] = obj[i]
      }
    }
    return result
  }
}

const instance = new Objects()
export default instance
