import { ObjectDirective, VNode, DirectiveBinding } from "vue";
import { core } from "#moong/core/utils";

type ScrollDirectiveOption =
  | boolean
  | (AddEventListenerOptions & { amount?: number; duration?: number });

interface ScrollVNodeDirective extends Omit<DirectiveBinding, "modifiers"> {
  value:
    | EventListener
    | {
        handler: EventListener;
        options?: ScrollDirectiveOption;
      }
    | (EventListenerObject & { options?: ScrollDirectiveOption });
  modifiers?: {
    self?: boolean;
    bottom?: boolean;
    top?: boolean;
  };
}

function mounted(el: HTMLElement, binding: ScrollVNodeDirective, vnode: VNode) {
  const { self = false, bottom = false, top = false } = binding.modifiers || {};
  const value = binding.value;
  const options = core.deepMerge(
    { passive: true, amount: 10, duration: 0 },
    (typeof value === "object" && value.options) || {}
  );
  const originHandler =
    typeof value === "function" || "handleEvent" in value
      ? value
      : value.handler;

  const target = self
    ? el
    : binding.arg
      ? document.querySelector(binding.arg)
      : window;

  if (!target) return;

  const handler = (e) => {
    // @ts-ignore
    const storedOptions = el._onScroll![vnode.context!._uid];

    if (!storedOptions) {
      return;
    }

    const { handler, options, target, lastFired, lastPosition } = storedOptions;
    const scrollLeft = Math.ceil(
      target === window ? window.scrollX : e.target.scrollLeft
    );
    const scrollTop = Math.ceil(
      target === window ? window.scrollY : e.target.scrollTop
    );
    const scrollHeight =
      target === window
        ? Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
          )
        : e.target.scrollHeight;
    const height =
      target === window ? window.innerHeight : e.target.clientHeight;
    storedOptions.lastPosition = [scrollLeft, scrollTop];

    if (
      options.duration > 0 &&
      lastFired &&
      lastFired + options.duration > new Date().getTime()
    ) {
      return;
    }

    if (
      bottom &&
      (scrollHeight - (height + scrollTop) > options.amount ||
        (lastPosition && lastPosition[1] >= scrollTop))
    ) {
      return;
    }

    if (
      top &&
      (!lastPosition ||
        scrollTop > options.amount ||
        lastPosition[1] <= scrollTop)
    ) {
      return;
    }

    e.scrollHeight = scrollHeight;
    e.scrollTop = scrollTop;
    e.scrollLeft = scrollLeft;
    e.lastPosition = lastPosition;
    e.height = height;

    storedOptions.lastFired = new Date().getTime();
    storedOptions.lastPosition = [scrollLeft, scrollTop];

    // @ts-ignore
    originHandler(e);
  };

  target.addEventListener("scroll", handler, options);

  // @ts-ignore
  el._onScroll = Object(el._onScroll);
  // @ts-ignore
  el._onScroll![vnode.context!._uid] = {
    handler,
    options,
    // Don't reference self
    target: self ? undefined : target,
  };
}

function unmounted(
  el: HTMLElement,
  binding: ScrollVNodeDirective,
  vnode: VNode
) {
  // @ts-ignore
  if (!el._onScroll?.[vnode.context!._uid]) return;

  // @ts-ignore
  const { handler, options, target = el } = el._onScroll[vnode.context!._uid]!;

  target.removeEventListener("scroll", handler, options);
  // @ts-ignore
  delete el._onScroll[vnode.context!._uid];
}

export const scroll: ObjectDirective = {
  mounted,
  unmounted,
};
