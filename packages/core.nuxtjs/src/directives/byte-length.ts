import { ObjectDirective } from 'vue'
import { string as stringUtils } from '#ustra/core/utils'

const getTargetEl = (el: HTMLElement) => {
  const queryTags = 'input,textarea'

  if (queryTags.includes(el.tagName.toLowerCase())) {
    return el as HTMLElement
  }

  return el.querySelector(queryTags) as HTMLElement
}

/**
 * input, textarea 입력을 제어
 */
export const byteLength: ObjectDirective = {
  mounted(el, binding, vnode, prevVnode) {
    if (!binding.value) {
      return
    }

    const input: HTMLElement = getTargetEl(el)

    input.addEventListener('input', _e => {
      const value = _e.target['value']
      if (stringUtils.byteLength(value) > binding.value) {
        _e.target['value'] = stringUtils.cutByteLength(value, binding.value)
      }
    })
  },
}
