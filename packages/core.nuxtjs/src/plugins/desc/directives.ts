import { byteLength, clickOutside, intersect, scroll, focus, image } from '../../directives'
import { NuxtApp } from '#app'

export const registerDirectives = (nuxtApp: NuxtApp) => {
  nuxtApp.vueApp.directive('byteLength', byteLength)
  nuxtApp.vueApp.directive('clickOutside', clickOutside)
  nuxtApp.vueApp.directive('intersect', intersect)
  nuxtApp.vueApp.directive('scroll', scroll)
  nuxtApp.vueApp.directive('focus', focus)
  nuxtApp.vueApp.directive('image', image)
}
