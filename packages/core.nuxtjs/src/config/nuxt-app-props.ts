import { AppProps, LogLevel, Profile, DeviceType } from '#ustra/core/config/props'
import {
  NuxtOptions,
  WijmoOptions,
  WijmoSampleMenuOptions,
  VuetifyOptions,
  VuetifySampleMenuOptions,
  VueuseOptions,
  MarkdownOptions,
  UiOptions,
  ApiOptions,
  ApiOriginOptions,
  BuildOptions,
  EnvOptions,
  ManagementOptions,
  PiniaOptions,
  UtilityOptions,
  CacheOptions,
} from './props/nuxt'

/**
 * Nuxt 설정 정보
 */
interface NuxtAppProps extends AppProps {
  /**
   * nuxt 설정
   */
  nuxt?: NuxtOptions
}

export { LogLevel, Profile, DeviceType }
export type {
  NuxtAppProps,
  EnvOptions,
  BuildOptions,
  NuxtOptions,
  WijmoOptions,
  WijmoSampleMenuOptions,
  VuetifyOptions,
  VuetifySampleMenuOptions,
  VueuseOptions,
  ManagementOptions,
  MarkdownOptions,
  UiOptions,
  ApiOptions,
  ApiOriginOptions,
  PiniaOptions,
  UtilityOptions,
  CacheOptions,
}
