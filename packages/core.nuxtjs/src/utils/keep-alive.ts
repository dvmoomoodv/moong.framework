/**
 * Keep Alive 관련 유틸리티
 * @exports {@link KeepAlive}
 * @packageDocumentation
 */
import { getCurrentInstance } from "#moong/nuxt";
import { ComponentInternalInstance } from "#moong/nuxt";
import type { Ustra } from "../plugins/ustra";

export class KeepAlive {
  constructor(private $ustra: Ustra) {}

  /**
   * 현재 컴포넌트의 KeepAlive Component 목록을 조회한다.
   * @param instance 컴포넌트 내부 instance
   * @returns
   */
  getCurrentKeepAliveComponents(instance?: ComponentInternalInstance) {
    instance ||= getCurrentInstance();

    console.log("instance", instance);

    if (!instance) {
      return [];
    }

    return $ustra.utils.component.findChildComponents(
      instance,
      (child) => child?.type?.["__isKeepAlive"] === true
    );
  }

  /**
   * app에 존재하는 모든 KeepAliveComponents를 조회한다.
   */
  getAllKeepAliveComponents() {
    const rootComponent =
      this.$ustra.nuxtApp.vueApp._instance ||
      this.$ustra.nuxtApp.vueApp._container?.["_vnode"]?.component;

    console.log("rootComponent", rootComponent);
    if (!rootComponent) {
      return [];
    }

    return $ustra.utils.component
      .findChildComponents(rootComponent, (child) => {
        return (
          child?.type?.["__isKeepAlive"] === true ||
          child.subTree?.type?.["__isKeepAlive"] === true
        );
      })
      .map((child) => {
        if (child.subTree?.type?.["__isKeepAlive"] === true) {
          return child.subTree.component;
        }
        return child;
      });
  }

  /**
   * 페이지 캐시를 지운다.
   * @param predicator
   */
  removePageCache(predicate?: (name: string) => boolean) {
    const keepAliveComponents = this.getAllKeepAliveComponents();

    if (keepAliveComponents.length > 0) {
      this.remove(keepAliveComponents[0], predicate);
    }
  }

  /**
   * KeepAlive Compoonent의 저장된 캐시를 모두 제거한다.
   * @param keepAliveComponent KeepAlive 컴포넌트 인스턴스
   * @param predicate 삭제 여부를 판단하는 function
   */
  remove(
    keepAliveComponent: ComponentInternalInstance,
    predicate?: (name: string) => boolean
  ) {
    if (!keepAliveComponent) {
      return;
    }

    if (keepAliveComponent["__v_cache"]) {
      const removingEntiries = [];
      for (const cachedEntry of keepAliveComponent["__v_cache"]) {
        if (Array.isArray(cachedEntry)) {
          const result = !predicate
            ? true
            : predicate(cachedEntry[1]?.type?.name);

          if (result === true) {
            removingEntiries.push(cachedEntry[0]);
          }
        }
      }

      for (const key of removingEntiries) {
        keepAliveComponent["__v_cache"].delete(key);
      }

      // keepAliveComponent['__v_cache']?.clear()
    }
  }
}
