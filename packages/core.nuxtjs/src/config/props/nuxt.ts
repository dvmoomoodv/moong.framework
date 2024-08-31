/**
 * Nuxt 관련 설정
 * @packageDocumentation
 */
import type { RouterOptions } from './router'
import type { ErrorOptions } from './error'
import type { WijmoOptions, WijmoSampleMenuOptions } from './wijmo'
import type { VuetifyOptions, VuetifySampleMenuOptions } from './vuetify'
import type { VueuseOptions } from './vueuse'
import type { MarkdownOptions } from './markdown'
import type { PiniaOptions } from './pinia'
import type { UiOptions } from './ui'
import type { ApiOptions, ApiOriginOptions } from './api'
import type { BuildOptions, PrivateBuildOptions } from './build'
import type { EnvOptions } from './env'
import type { ManagementOptions } from './management'
import type { Ckeditor5Options } from './ckeditor5'
import type { RouteMeta } from 'vue-router'
import type { UtilityOptions } from './utility'
import type { CacheOptions } from './cache'

/**
 * nuxt 관련 설정
 */
export interface NuxtOptions extends Record<string, any> {
  /**
   * meta 기본 설정
   */
  meta?: RouteMeta

  /**
   * router 설정
   */
  router?: RouterOptions

  /**
   * 에러 관련 설정
   */
  error?: ErrorOptions

  /**
   * wijmo 설정
   */
  wijmo?: WijmoOptions

  /**
   * vuetify 설정
   */
  vuetify?: VuetifyOptions

  /**
   * vueuse 설정
   */
  vueuse?: VueuseOptions

  /**
   * markdown 설정
   */
  markdown?: MarkdownOptions

  /**
   * pinia 설정
   */
  pinia?: PiniaOptions

  /**
   * UI 설정
   */
  ui?: UiOptions

  /**
   * API 기본 설정
   */
  api?: ApiOptions

  /**
   * 환경 설정 정보
   */
  env?: EnvOptions

  /**
   * 빌드 설정
   */
  build?: BuildOptions

  /**
   * 관리 시스템 설정
   */
  management?: ManagementOptions

  /**
   * ckeditor5 option
   */
  ckeditor5?: Ckeditor5Options

  /**
   * 컴포넌트 설정
   */
  components?: any

  /**
   * 디렉티브 설정
   */
  directives?: any

  /**
   * 유틸리티 기능 설정
   */
  utilities?: UtilityOptions

  /**
   * 캐시 설정
   */
  cache?: CacheOptions

  /**
   * experimental 기능
   */
  experimental?: {
    /**
     * 모듈의 Chunk 분리 처리
     * @default false
     */
    splitChunkModules?: boolean

    /**
     * 번들 압축
     * @default true
     */
    compressBundle?: boolean
  }

  /**
   * private 빌드 설정
   */
  _build?: PrivateBuildOptions
}

export {
  WijmoOptions,
  WijmoSampleMenuOptions,
  VuetifyOptions,
  VuetifySampleMenuOptions,
  VueuseOptions,
  MarkdownOptions,
  PiniaOptions,
  UiOptions,
  ApiOptions,
  ApiOriginOptions,
  EnvOptions,
  BuildOptions,
  ManagementOptions,
  UtilityOptions,
  CacheOptions,
}
