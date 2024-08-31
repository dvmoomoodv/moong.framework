/**
 * Component 관련 유틸리티
 * @exports {@link Component}
 * @packageDocumentation
 */
import { ComponentInternalInstance, VNode, createVNode, render, createApp, h, shallowRef, onBeforeUnmount, getCurrentInstance } from '#ustra/nuxt'
import type { VNodeChild, VNodeProps, Component as VueComponent } from '#ustra/nuxt'
import { nextTick } from '#ustra/nuxt'
import { useRoute, useRouter } from '#app'
import { core } from '#ustra/core/utils'

export interface AppMountOption {
  /**
   * 컴포넌트 children
   */
  children?: VNodeChild

  /**
   * target HTMLElement for mount
   */
  renderEl?: HTMLElement
}

export interface ExtendedVNodeProps extends VNodeProps, Record<string, unknown> {}
export { VNodeChild, VueComponent }

export class Component {
  /**
   * element의 Vue 컴포넌트 여부 확인
   * @param el element
   * @returns
   */
  isVueComponent(elOrInstance: any) {
    if (!elOrInstance) {
      return false
    }

    if (elOrInstance.ctx || elOrInstance.$options) {
      return true
    }

    // for customized mixins...
    if (elOrInstance.__vueComponent) {
      return true
    }

    return elOrInstance.__vueParentComponent?.vnode?.el === elOrInstance
  }

  /**
   * element에서 vnode props 조회
   * @param elOrInstance Element or Vue component
   * @param addAttrs with attrs when vue component
   * @param includeParent include parent
   */
  getVNodeProps(elOrInstance: any, addAttrs: boolean = false) {
    if (!elOrInstance) {
      return null
    }

    const components = this.getWrappedComponents(elOrInstance)

    if (components.length < 1) {
      return elOrInstance?.__vnode?.props || {}
    }

    let props = {}
    for (const component of components) {
      if (addAttrs) {
        props = core.deepMergeArrayConcat(props, component.attrs || {})
      }
      props = core.deepMergeArrayConcat(props, component.props || {})
    }
    return props
  }

  /**
   * element or component instance에서 vnode 조회
   * @param elOrInstance Element or Vue component
   */
  getVNode(elOrInstance: any) {
    if (!elOrInstance) {
      return null
    }

    if (elOrInstance.__vueComponent) {
      elOrInstance = elOrInstance.__vueComponent
    }

    return elOrInstance?.__vnode || elOrInstance?.vnode
  }

  /**
   * el 또는 instance에서 Vue Component 객체를 조회
   * @param elOrInstance Element or Vue component
   */
  getVueComponent(elOrInstance: any) {
    if (!this.isVueComponent(elOrInstance)) {
      return null
    }

    // mixins
    if (elOrInstance.__vueComponent) {
      return elOrInstance.__vueComponent._.proxy
    }

    if (elOrInstance.__vueParentComponent) {
      elOrInstance = elOrInstance.__vueParentComponent
    }

    // vue3 component
    if (elOrInstance.vnode && elOrInstance.proxy) {
      return elOrInstance.proxy
    }

    // vue2 component
    if (elOrInstance.$options) {
      return elOrInstance
    }
  }

  /**
   * el 또는 instance에서 Vue Component 객체를 조회
   * @param elOrInstance Element or Vue component
   */
  getWrappedComponent(elOrInstance: any) {
    if (!this.isVueComponent(elOrInstance)) {
      return null
    }

    if (elOrInstance.__vueParentComponent) {
      elOrInstance = elOrInstance.__vueParentComponent
    }

    // for mixins
    if (elOrInstance.__vueComponent) {
      return elOrInstance.__vueComponent._
    }

    // for proxy
    if (elOrInstance.$) {
      return elOrInstance.$
    }

    return elOrInstance
  }

  /**
   * el 또는 instance에서 Vue Components 인스턴스 목록을 조회
   * @param elOrInstance
   */
  getWrappedComponents(elOrInstance: any) {
    if (!this.isVueComponent(elOrInstance)) {
      return []
    }

    if (elOrInstance.__vueComponentInstances) {
      return elOrInstance.__vueComponentInstances.map(c => c.$)
    }

    const component = this.getWrappedComponent(elOrInstance)

    if (component) {
      return [component]
    }

    return []
  }

  /**
   * 대상 컴포넌트가 현재 로딩된 페이지 컴포넌트인지 확인
   * @param component
   */
  isPageComponent(component: ComponentInternalInstance) {
    const route = useRoute()

    if (!route) {
      return false
    }

    for (const match of route.matched) {
      const matchedComponent = match.components.default

      if (matchedComponent === component.type) {
        return true
      }
    }

    return false
  }

  /**
   * 하위 노드를 검색한다.
   * @param nodes VNode 목록
   * @param filterFn 필터링 function
   */
  queryChildNodes(nodes: VNode | VNode[], filterFn: (node: VNode) => boolean = node => true) {
    nodes = Array.isArray(nodes) ? nodes : [nodes]

    function findChild(nodes: VNode[]) {
      let foundNodes: VNode[] = []

      for (const node of nodes) {
        if (filterFn(node)) {
          foundNodes.push(node)
        }

        if (node.children?.['default']) {
          foundNodes = foundNodes.concat(findChild(node.children?.['default']()))
        }
      }

      return foundNodes
    }

    return findChild(nodes)
  }

  /**
   * 컴포넌트를 동적 mount
   * @param component
   * @param param1
   * @returns
   *
   * ```typescript
   * const root = ref<HTMLDivElement>(null)
   *   onMounted(() => {
   *     const { el } = component.mount(UButton, {
   *       app: useNuxtApp().vueApp,
   *       props: {
   *         text: 'Test',
   *       },
   *       children: undefined,
   *       element: undefined,
   *     })
   *     root.value.appendChild(el)
   *   })
   * ```
   */
  mount(
    component,
    instance: ComponentInternalInstance,
    { props, children, element }: { props?: any; children?: any; element?: any } = {
      props: undefined,
      children: undefined,
      element: undefined,
    },
  ) {
    let el = element

    let vNode = createVNode(component, props, children)
    vNode.appContext = instance.appContext

    if (!el) {
      el = document.createElement('div')
    }

    const destroy = () => {
      if (el) render(null, el)
      el = null
      vNode = null
    }

    render(vNode, el)

    onBeforeUnmount(() => destroy(), instance)

    return { vNode, destroy, el }
  }

  /**
   * component를 App으로 Mount
   * @param rootComponent 컴포넌트 정의 Object
   * @param rootProps 컴포넌트 Props
   * @param options 상세 옵션
   * @returns
   */
  mountApp<T extends VueComponent>(rootComponent: T, rootProps: ExtendedVNodeProps = {}, options: AppMountOption = {}) {
    const componentInstance = shallowRef<T>()

    if (!rootProps?.ref) {
      // @ts-ignore
      rootProps.ref = instance => (componentInstance.value = instance)
    }

    function render() {
      // @ts-ignore
      return () => h(rootComponent, rootProps, options.children || [])
    }

    /**
     * mount function
     * @param el HTMLElement
     */
    function mount(el: HTMLElement) {
      const wrapper = document.createElement('div')
      app.mount(wrapper)
      el.appendChild(wrapper)
    }

    const app = createApp({
      setup() {
        return render()
      },
    })

    if (options?.renderEl) {
      mount(options?.renderEl)
    }

    return { app, render, componentInstance, mount }
  }

  /**
   * 컴포넌트의 Root Element 목록을 조회한다.
   * @param component
   * @returns
   */
  getRootElements(component: ComponentInternalInstance): HTMLElement[] {
    const elements: HTMLElement[] = []

    if (!component) {
      return elements
    }

    if (component.vnode?.el && component.vnode.el.nodeType === 1) {
      return [component.vnode.el as HTMLElement]
    }

    const addChildren = children => {
      for (let i = 0; i < children.length; i++) {
        const child = children[i]

        if (child.el && child.el.nodeType === 1) {
          elements.push(child.el)
        }
        // fragments
        else if (child.el && child.el.nodeType === 3) {
          elements.push(...this.getRootElements(child.component))

          if (child.children) {
            addChildren(child.children)
          }
        }
      }
    }

    const children = component.subTree?.children

    if (children) {
      addChildren(children)
    }

    return elements
  }

  /**
   * 하위 컴포넌트 목록을 type으로 검색
   * @param component
   * @param type
   */
  findChildComponentsByType(component: ComponentInternalInstance, type: string) {
    return this.findChildComponents(component, child => child.type?.name === type)
  }

  /**
   * 하위 컴포넌트 조회
   * @param component 컴포넌트 인스턴스
   * @param predicator 비교 function
   */
  findChildComponents(component: ComponentInternalInstance, predicator: (component: ComponentInternalInstance) => boolean | void) {
    const foundComponents: ComponentInternalInstance[] = []

    const findChildren = children => {
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        const result = predicator(child)

        if (result === true) {
          if (child.component) {
            foundComponents.push(child.component)
          } else if (child.subTree) {
            foundComponents.push(child)
          }
        }

        findChildren(this.findComponentChildren(child))
      }
    }

    findChildren(this.findComponentChildren(component))

    return foundComponents
  }

  /**
   * 대상 컴포넌트 하위의 컴포넌트 목록을 찾는다.
   * @param component
   * @returns
   */
  findComponentChildren(component: ComponentInternalInstance) {
    if (!component) {
      return []
    }

    if (Array.isArray(component['children'])) {
      return component['children']
    }

    if (Array.isArray(component['component']?.subTree?.children)) {
      return component['component']?.subTree?.children
    }

    if (Array.isArray(component.subTree?.children)) {
      return component.subTree?.children
    }

    if (component.subTree?.['ssContent']?.['component']) {
      return [component.subTree?.['ssContent']?.['component']]
    }

    if (component['component']?.subTree?.['ssContent']?.['component']) {
      return [component['component']?.subTree?.['ssContent']?.['component']]
    }

    if (component['ssContent']) {
      return [component['ssContent']]
    }

    if (component['component']?.subTree?.['component']) {
      return [component['component']?.subTree?.['component']]
    }

    if (component.subTree?.['component']) {
      return [component.subTree?.['component']]
    }

    return []
  }
}

const instance = new Component()
export default instance
