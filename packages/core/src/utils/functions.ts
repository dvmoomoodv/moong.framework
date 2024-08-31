/**
 * Functions 유틸리티
 * @packageDocumentation
 */
export class Functions {
  /**
   * wrap function
   * @param originFn origin function
   * @param wrapProcFn wrap proc
   *
   * ```typescript
   * wrap(originFunction, (next, ...args) => {
   *  // action before something
   *  // execute originFunction
   *  next()
   *  // action after something
   * })
   * ```
   */
  wrap<T extends Function>(originFn: T, wrapProcFn: (next: Function, args?: any[]) => any | void): T {
    const backupFn = originFn

    // @ts-ignore
    originFn = function () {
      const args = Array.from(arguments)

      const nextFn: Function = function () {
        if (backupFn) {
          // @ts-ignore
          return backupFn.apply(this, arguments)
        }
        // @ts-ignore
      }.bind(this, ...args)

      // @ts-ignore
      return wrapProcFn.apply(this, [nextFn, args])
    }

    return originFn
  }

  /**
   * promise 객체 여부 판단
   * @param obj
   */
  isPromise(obj) {
    return obj instanceof Promise || (obj && typeof obj.then === 'function')
  }

  /**
   * function을 문자열로 변경
   * @param func
   * @returns
   */
  toString(func: Function) {
    if (typeof func !== 'function') {
      return null
    }

    const funcString = '' + func
    if (funcString.startsWith('function')) {
      return funcString
    }

    if (funcString.startsWith('(')) {
      return funcString
    }

    return 'function ' + funcString.substring(funcString.indexOf('('))
  }
}

const instance = new Functions()
export default instance
