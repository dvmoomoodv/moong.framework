import { ObjectDirective } from 'vue'
import { core } from '#ustra/core/utils'

function directive(e, el, option) {
  if (!e || option.isActive(e) === false) return

  const elements = option.elements()
  elements.push(el)

  !elements.some(el => el.contains(e.target)) &&
    setTimeout(() => {
      option.isActive(e) && option.handler && option.handler(e)
    }, 0)
}

const defaultOption = {
  /**
   * 통지시의 핸들러
   */
  handler: null,

  /**
   * 클릭하지 않을 대상 element 목록
   */
  elements: () => [],
  isActive: () => true,
  type: 'click',
  hideOnMove: false,
}

export const clickOutside: ObjectDirective = {
  mounted: (el, binding) => {
    let option = null

    if (typeof binding.value === 'function') {
      option = core.deepMerge<any>({}, defaultOption, {
        handler: binding.value,
        type: binding.value.type,
      })
    } else if (typeof binding.value === 'object') {
      option = core.deepMerge<any>({}, defaultOption, {
        handler: binding.value.handler,
        elements: binding.value.include,
        isActive: binding.value.closeConditional,
        type: binding.value.type,
        hideOnMove: binding.value.hideOnMove,
      })
    } else {
      throw new TypeError('clickDirective arguments is wrong.')
    }

    const onClick = e => directive(e, el, option)

    const app = document.body
    option.type.split(',').forEach(type => app.addEventListener(type, onClick, true))

    if (option.hideOnMove) {
      const onMove = () => setTimeout(() => option.handler(), 0)
      // app.addEventListener('mousemove', onMove)
      app.addEventListener('touchmove', onMove)
      // @ts-ignore
      el._onMove = onMove
    }

    // @ts-ignore
    el._clickOutside = onClick
    // @ts-ignore
    el._clickOutsideType = option.type
  },
  unmounted: el => {
    const app = document.body

    // @ts-ignore
    if (el._onMove) {
      // @ts-ignore
      // app && app.removeEventListener('mousemove', el._onMove, true)
      // @ts-ignore
      app && app.removeEventListener('touchmove', el._onMove, true)

      // @ts-ignore
      delete el._onMove
    }

    // @ts-ignore
    if (el._clickOutsideType && el._clickOutside) {
      // @ts-ignore
      el._clickOutsideType.split(',').forEach(type => {
        // @ts-ignore
        app && app.removeEventListener(type, el._clickOutside, true)
      })

      // @ts-ignore
      delete el._clickOutside
      // @ts-ignore
      delete el._clickOutsideType
    } else {
      return null
    }
  },
}
