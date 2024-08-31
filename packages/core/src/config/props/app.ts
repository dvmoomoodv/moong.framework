/**
 * APP 관련 설정
 * @packageDocumentation
 */
import { Profile } from '../env'

/**
 * 디바이스 유형
 */
export enum DeviceType {
  ALL = 'ALL',
  DESKTOP = 'DESKTOP',
  MOBILE = 'MOBILE',
  NODE = 'NODE',
}

/**
 * 서버 유형
 */
export enum ServerType {
  NONE = 'NONE',
  CONNECT = 'CONNECT',
  EXPRESS = 'EXPRESS',
  NITRO = 'NITRO',
}

export interface App extends Record<string, any> {
  /**
   * appllication process absolute path
   */
  processPath?: string

  /**
   * current profile
   */
  profile?: Profile | string

  /**
   * application device type
   */
  deviceType?: DeviceType

  /**
   * application version
   */
  version?: string

  /**
   * banner string
   */
  banner?: string

  /**
   * application title
   */
  title?: string

  /**
   * config directory 경로
   */
  configDirPath?: string
}

export { Profile }
export type { App as App3 }
