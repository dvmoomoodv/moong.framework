import { ObjectDirective, DirectiveBinding, VNode } from 'vue'

type ObserveHandler = (entries: IntersectionObserverEntry[], observer: IntersectionObserver, isIntersecting: boolean) => void

interface ObserveVNodeDirective extends Omit<DirectiveBinding, 'modifiers' | 'value'> {
  /**
   * handler 또는 options
   */
  value?: ObserveHandler | { handler: ObserveHandler; options?: IntersectionObserverInit }
  modifiers?: {
    once?: boolean
    quiet?: boolean
  }
}
function mounted(el: HTMLElement, binding: ObserveVNodeDirective, vnode: VNode) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

  const modifiers = binding.modifiers || {}
  const value = binding.value

  const { handler, options } = typeof value === 'object' ? value : { handler: value, options: {} }
  const observer = new IntersectionObserver((entries: IntersectionObserverEntry[] = [], observer: IntersectionObserver) => {
    // @ts-ignore
    const _observe = el._observe?.[vnode.context!._uid]
    if (!_observe) return // Just in case, should never fire

    const isIntersecting = entries.some(entry => entry.isIntersecting)

    // If is not quiet or has already been
    // initted, invoke the user callback
    if (handler && (!modifiers.quiet || _observe.init) && (!modifiers.once || isIntersecting || _observe.init)) {
      handler(entries, observer, isIntersecting)
    }

    if (isIntersecting && modifiers.once) unmounted(el, binding, vnode)
    else _observe.init = true
  }, options)

  // @ts-ignore
  el._observe = Object(el._observe)

  // @ts-ignore
  el._observe![vnode.context!._uid] = { init: false, observer }

  observer.observe(el)
}

function unmounted(el: HTMLElement, binding: ObserveVNodeDirective, vnode: VNode) {
  // @ts-ignore
  const observe = el._observe?.[vnode.context!._uid]
  if (!observe) return

  observe.observer.unobserve(el)

  // @ts-ignore
  delete el._observe![vnode.context!._uid]
}

export const intersect: ObjectDirective = {
  mounted,
  unmounted,
}
