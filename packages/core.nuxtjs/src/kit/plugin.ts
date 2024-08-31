import { useNuxt, addComponent as addComponent$1, AddComponentOptions } from '@nuxt/kit'
import { FRAMEWORK_MODULE_DEFINITION } from '#ustra/core/config/framework/modules'
import { NuxtAppProps } from '../config'
import { resolveFrameworkModulePath } from './build'

/**
 * ustra option을 조회한다.
 * @returns
 */
export const useUstra = () => {
  const nuxt = useNuxt()
  return nuxt.options['ustra'] as NuxtAppProps
}

/**
 * U.STRA 플러그인에 프로퍼티를 추가
 *  $ustra[propName] 형태로 조회가 가능하다.
 * @param propName 프로퍼티 명
 * @param modulePath 모듈의 절대경로
 * @param moduleAlias 모듈의 별칭
 */
export const addPluginProperty = (propName: string, modulePath: string, moduleAlias: string) => {
  const ustra = useUstra()
  ustra.nuxt._build.pluginProps.push({
    propName,
    modulePath,
    moduleAlias,
  })
}

/**
 * 컴포넌트를 추가 등록 한다.
 */
export const addComponent = (option: AddComponentOptions) => {
  option.filePath = resolveFrameworkModulePath(option.filePath)
  return addComponent$1(option)
}
