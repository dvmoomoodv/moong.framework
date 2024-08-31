/**
 * array 관련 유틸리티
 * @packageDocumentation
 */

export class ArrayUtils {
  /**
   * Array 값이 empty 인지 검사
   * @param arr 배열
   * @returns empty 여부
   */
  isEmpty(arr: Array<unknown>) {
    return !arr || arr.length < 1
  }

  /**
   * object array의 특정 키 값으로 유일한 array를 추출한다.
   * @param arr 배열
   * @param key 키 값
   */
  uniqueBy<T, K extends keyof T>(arr: T[], key: K) {
    const res: T[] = []
    const seen = new Set<T[K]>()
    for (const item of arr) {
      if (seen.has(item[key])) {
        continue
      }
      seen.add(item[key])
      res.push(item)
    }
    return res
  }
}

const instance = new ArrayUtils()
export default instance
