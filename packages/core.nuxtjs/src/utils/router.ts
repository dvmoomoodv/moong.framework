/**
 * Router 관련 유틸리티
 * @exports {@link Router}
 * @packageDocumentation
 */
import { useRouter, useRoute } from '#app'
import { defineAsyncComponent, defineComponent } from '#ustra/nuxt'

export class Router {
  /**
   * 경로로 컴포넌트를 검색
   * @param path
   * @returns
   */
  findComponentByPath(path: string): ReturnType<typeof defineAsyncComponent | typeof defineComponent> {
    const route = useRouter().resolve(path)

    if (!route || route.matched.length < 1) {
      return null
    }

    const component = route.matched[0].components.default

    // @ts-ignore
    return typeof component === 'function' ? defineAsyncComponent(component) : component
  }

  /**
   * 경로로 route를 조회
   * @param path
   * @returns
   */
  findRoute(path: string): ReturnType<typeof useRoute> {
    return useRouter().resolve(path)
  }

  /**
   * 2개의 경로가 동일한지 여부를 비교
   * @param path1 경로1
   * @param path2 경로2
   */
  equalPath(path1: string, path2: string) {
    if (!path1 || !path2) {
      return false
    }

    path1 = path1.endsWith('/') ? path1 : path1 + '/'
    path2 = path2.endsWith('/') ? path2 : path2 + '/'

    return path1 === path2
  }
}

const instance = new Router()
export default instance
