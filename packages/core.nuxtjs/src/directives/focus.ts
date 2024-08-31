import { ObjectDirective, nextTick, isRef, watch } from "vue";
import { core } from "#moong/core/utils";
import { dom } from "#moong/core/utils/browser";

/**
 * input box or button focus
 */
export const focus: ObjectDirective = {
  mounted(el, binding) {
    const value = isRef(binding.value)
      ? binding.value.value
      : core.defaults(binding.value, true);

    if (isRef(binding.value)) {
      watch(binding.value, (v) => {
        if (v === true) {
          nextTick(() => {
            const input: HTMLElement = dom.findFocusableEl(el);

            if (input) {
              nextTick(() => input.focus());
              binding.value.value = false;
            }
          });
        }
      });
    }

    if (value) {
      nextTick(() => {
        const input: HTMLElement = dom.findFocusableEl(el);

        if (input) {
          nextTick(() => input.focus());
        }
      });
    }
  },
  updated(el, binding) {},
};
