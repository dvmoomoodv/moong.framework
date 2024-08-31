/**
 * System 유틸리티
 * @packageDocumentation
 */
import { v4 as uuid } from 'uuid'
import uuid62 from 'uuid62'

export class System {
  /**
   * create uuid
   * @param id {string} 생성할 id 기준 문자열 없을 경우, random
   * @returns
   */
  uuid(id?: string) {
    return uuid(id)
  }

  /**
   * create base62 converted uuid
   */
  uuidBase62(): string {
    return uuid62.v4()
  }
}

const instance = new System()
export default instance
