import { Auth } from '../props/auth'
import { Logging, LogLevel } from '../props/logging'
import { App, DeviceType, Profile } from '../props/app'
import { Mobile } from './mobile'
import { Interface } from './interface'
import { Server } from '../props/server'
import { I18nProps } from './i18n'

export interface AppProps extends Record<string, any> {
  /**
   * 디버그 여부
   * @default false
   */
  debug?: boolean

  /**
   * 어플리케이션 설정
   */
  app?: App

  /**
   * 인증 설정
   */
  auth?: Auth

  /**
   * 로깅 설정
   */
  logging?: Logging

  /**
   * 서버 설정
   */
  server?: Server

  /**
   * 모바일 설정
   */
  mobile?: Mobile

  /**
   * 인터페이스 설정
   */
  interfaces?: Interface

  /**
   * 다국어 설정
   */
  i18n?: I18nProps
}

export type { App, Auth, Logging, Server }
export { LogLevel, DeviceType, Profile }
