/**
 * TODO: Module Description
 * @exports {@link Test}
 * @exports {@link instance}
 * @packageDocumentation
 */

export class Test {
  /**
   * Jest 테스트 실행 여부
   * @returns 실행 여부 값
   */
  isjestTest() {
    // @ts-ignore
    return ![0, undefined].includes(process.env.JEST_WORKER_ID)
  }
}

const instance = new Test()
export default instance
