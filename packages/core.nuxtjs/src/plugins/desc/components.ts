import type { Ustra } from '../ustra'

export class UstraComponents {
  constructor(private $ustra: Ustra) {}

  /**
   * 컴포넌트의 옵션 설정
   * @param componentName 컴포넌트 명
   * @param option 옵션
   */
  setComponentsOptions(componentName: string, option: Record<string, any>) {
    const componentProps = this.$ustra.env.appProps.nuxt.components[componentName] || {}
    this.$ustra.env.appProps.nuxt.components[componentName] = $ustra.utils.core.deepMerge(componentProps, option)
  }

  /**
   * 컴포넌트의 옵션 조회
   * @param componentName 컴포넌트 명
   */
  getComponentsOption(componentName: string) {
    return this.$ustra.env.appProps.nuxt.components[componentName] || {}
  }
}
