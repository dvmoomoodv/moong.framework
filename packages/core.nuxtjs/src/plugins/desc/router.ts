import type { Ustra } from '../ustra'
import { RouteLocationRaw, RouteLocation } from 'vue-router'
import { navigateTo, useRouter } from '#app'

export class UstraRouter {
  constructor(private $ustra: Ustra) {}

  /**
   * router 이동
   * @param to
   */
  push(to: RouteLocationRaw) {
    if (process.server) {
      navigateTo(to)
    } else {
      useRouter().push(to)
    }
  }

  /**
   * 후행 slash 제거 경로 조회
   * @param path 경로
   * @returns
   */
  withoutTrailingSlashPath(path: string) {
    if (!path) {
      return path
    }

    if (path.endsWith('/')) {
      return path.substring(0, path.length - 1)
    }

    return path
  }
}
