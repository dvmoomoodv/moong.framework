import { type Ustra } from '../plugins/ustra'
import { type RouteLocationNormalized } from 'vue-router'

/**
 * Auth validation 커스톰 로직 구현
 * @param setup
 * @returns
 */
export const defineUstraAuthValidator = (
  setup: (params: { $ustra: Ustra; to: RouteLocationNormalized; from: RouteLocationNormalized }) => void | Promise<void> | any | Promise<any>,
) => {
  return setup
}
