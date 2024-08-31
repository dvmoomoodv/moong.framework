/**
 * Random 유틸리티
 * @exports {@link Random}
 * @packageDocumentation
 */

export class Random {
  /**
   * 1부터 최대 값 까지의 random 값을 생성한다.
   * @param maxValue 최대 값
   */
  max(maxValue: number) {
    return Math.floor(Math.random() * maxValue) + 1
  }

  /**
   * 최소 최대 값 까지의 random 값을 생성한다.
   * @param minValue 최소 값
   * @param maxValue 최대 값
   */
  minMax(minValue: number, maxValue: number) {
    return Math.floor(Math.random() * maxValue - minValue) + minValue
  }
}

const instance = new Random()
export default instance
