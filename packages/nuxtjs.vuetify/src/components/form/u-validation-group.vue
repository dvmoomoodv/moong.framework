<template>
  <div
    v-if="props.wrapContainer"
    ref="root"
    :class="{
      'u-layout-state-disabled': props.disabled,
      [props.cssClassName]: props.wrapContainer,
    }"
  >
    <slot />
  </div>
  <template ref="root" v-else>
    <slot />
  </template>
</template>
<script lang="ts" setup>
import {
  onMounted,
  onUpdated,
  ref,
  defineExpose,
  nextTick,
  defineProps,
  withDefaults,
  watch,
  getCurrentInstance,
} from "#moong/nuxt";
import { validation, core, system } from "#moong/core/utils";
import { dom } from "#moong/core/utils/browser";
import { component as nuxtComponent, nuxt } from "#moong/nuxt/utils";
import {
  ValidationObjectRule,
  ValidationRule,
  toObjectRule,
} from "#moong/core/utils/validation/rules";
import tippy, { Instance } from "tippy.js";

export interface Props {
  /**
   * element를 validation 대상에 포함할지 여부를 결정
   * - boolean : true 포함, false 비포함
   * - exclude : 하위 Element 는 포함하지 않음.
   * - undefined : 다음 로직으로 skip
   */
  filterTargetElement?: (el: Element) => boolean | "exclude" | undefined;

  /**
   * validation 검증 전 필터링 로직 수행
   * - true : 검증 결과를 성공으로 리턴
   * - undefined : Validation 검증 수행
   */
  beforeValidate?: (el: Element) => Promise<true | undefined>;

  /**
   * validation rule을 추가
   * el : element
   * rules : 현재 설정된 rules
   */
  addElementValidationRule?: (
    el: Element,
    rules: ValidationObjectRule[]
  ) => undefined | ValidationRule[];

  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean;

  /**
   * 값 변경 시 validation 체크 여부
   * @default true
   */
  checkValidationOnUpdate?: boolean;

  /**
   * div container로 wrapping을 수행한다.
   * false일 경우는 slot 내에 class가 추가된다.
   * @default true
   */
  wrapContainer?: boolean;

  /**
   * CSS 클래스 명
   * @default 'ustra-validation-group'
   */
  cssClassName?: string;
}

const id = system.uuidBase62();
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  checkValidationOnUpdate: true,
  wrapContainer: true,
  cssClassName: () =>
    $ustra.components.getComponentsOption("UValidationGroup").cssClassName ||
    "ustra-validation-group",
});

let _isInitialized = true;
let _isInitializedTimer = null;

const root = ref<HTMLDivElement>(null);
const instance = getCurrentInstance();

function getRootEls(): HTMLElement[] {
  return nuxtComponent.getRootElements(instance);
}

// element를 validation fail 상태로 표시
function invalidateEl(els: Element[], messages: string[], addCss = true) {
  for (const el of els) {
    if (addCss) {
      el.classList.add("ustra-invalidate");
    }

    // const inputEl = getInputEl(el)
    const inputEl = el;

    if (!inputEl) {
      return;
    }

    el["_validateMessages"] = messages;
    setAdditionalProps(el, messages ? messages.join("\n") : "");

    if (!inputEl["_tippy"]) {
      tippy(inputEl, {
        content: messages.join("\n"),
        // trigger: 'focus',
        onShow(instance) {
          const messages = el["_validateMessages"] as string[];

          if (!messages || messages.length < 1) {
            return false;
          }

          instance.setContent(messages.join("\n"));
        },
      });
    } else {
      const tpy = inputEl["_tippy"] as Instance;
      if (tpy && dom.isFocus(inputEl)) {
        tpy.show();
      }
    }
  }
}

function setAdditionalProps(el: Element, validationMessage: string) {
  if (!el) {
    return;
  }

  nextTick(() => {
    const props = nuxtComponent.getVNodeProps(el, true);

    if (
      props["onValidationChanged"] &&
      typeof props["onValidationChanged"] === "function"
    ) {
      props["onValidationChanged"](!validationMessage, validationMessage);
    }
  });
}

// element의 validation 상태를 초기화
async function initEl(els: Element[], rootEl: Element = null) {
  els = core.deepMerge([], els);

  if (rootEl && rootEl["_validationEls"]) {
    els.push(...rootEl["_validationEls"]);
  }

  for (const el of els) {
    el.classList.remove("ustra-invalidate");
    el["_validateMessages"] = null;

    const inputEl = getInputEl(el);

    if (!inputEl) {
      continue;
    }

    const tpy = inputEl["_tippy"] as Instance;

    if (!tpy) {
      continue;
    }

    tpy.hide();
    setAdditionalProps(el, "");
  }

  if (rootEl && rootEl["_onValidationInit"]) {
    await rootEl["_onValidationInit"]();
  }

  setAdditionalProps(rootEl, "");
}

// element의 validation 상태를 검증
async function validateEl(el: Element, rules: ValidationObjectRule[]) {
  const validate = async () => {
    await initEl([el], el);

    if (_isInitialized) {
      return true;
    }

    let value = null;
    const comp = getVueComponent(el);

    if (props.beforeValidate) {
      const result = await props.beforeValidate(el);

      if (result === true) {
        await initEl([el], el);
        return true;
      }
    }

    if (nuxtComponent.isVueComponent(el)) {
      value = comp.modelValue === undefined ? comp.value : comp.modelValue;
    } else {
      value = el["value"];
    }

    const messages: Set<string> = new Set<string>();
    let validResult: any = false;
    for (const rule of rules) {
      if (rule.type === "required") {
        if (core.isEmpty(value)) {
          messages.add(rule.message || "필수 입력입니다.");
        }
      } else if (rule.type === "email") {
        if (value && !validation.email(value)) {
          messages.add(rule.message || "유효한 이메일 주소를 입력하십시오.");
        }
      } else if (rule.type === "custom") {
        if (rule._timer) {
          clearTimeout(rule._timer);
          rule._timer = null;
        }

        if (rule.delay) {
          validResult = await new Promise<string | boolean>((resolve) => {
            rule._timer = setTimeout(async () => {
              if (_isInitialized) {
                return;
              }

              const result = await rule.handler(value, comp || el);
              resolve(result);
            }, rule.delay);
          });
        } else {
          validResult = await rule.handler(value, comp || el);
        }

        validResult = normalizeResult(validResult);

        if (!validResult.isValid) {
          messages.add(
            validResult.message || rule.message || "유효한 입력이 아닙니다."
          );
        }
      }
    }

    validResult = normalizeResult(validResult);
    validResult.isValid = messages.size < 1;

    if (validResult.onInit) {
      el["_onValidationInit"] = validResult.onInit;
    }

    if (validResult.els) {
      el["_validationEls"] = validResult.els;
    }

    if (el["_validationEls"]) {
      validResult.els = el["_validationEls"];
    }

    if (messages.size > 0) {
      if (validResult.onValidated) {
        await initEl(validResult.els || [el], el);
        invalidateEl(validResult.els || [el], Array.from(messages), false);
        validResult.onValidated(false);
      } else {
        await initEl(validResult.els || [el], el);
        invalidateEl(validResult.els || [el], Array.from(messages));
      }

      return getWrappedComponent(el) || el;
    } else {
      if (validResult.onValidated) {
        await initEl(validResult.els || [el], el);
        validResult.onValidated(true);
      }
    }
    return true;
  };

  return await validate();
}

function normalizeResult(result) {
  if (typeof result === "string") {
    return {
      isValid: false,
      message: result,
    };
  }

  if (result === false) {
    return {
      isValid: false,
    };
  }

  if (typeof result === "object") {
    return result;
  }

  return {
    isValid: true,
  };
}

// element의 input element 조회
function getInputEl(el: Element) {
  return el.querySelector("input, texarea, select");
}

// element 내에서 validation 검증을 처리할 객체 조회
function getTargetEl(el) {
  // if (component.isWijmoComponent(el)) {
  //   console.log('cccc', el['$WJ-CTRL']['_e'], el)
  //   return el['$WJ-CTRL']['_e']
  // }

  return el;
}

function getVueComponent(elOrComponent) {
  const comp = nuxtComponent.getVueComponent(elOrComponent);

  if (!comp) {
    return comp;
  }

  if (comp._?.parent?.type?.name === "UDatepicker") {
    return comp._.parent.proxy;
  }

  return comp;
}

function getWrappedComponent(elOrComponent) {
  const comp = nuxtComponent.getWrappedComponent(elOrComponent);

  if (!comp) {
    return comp;
  }

  if (comp && comp.parent?.type?.name === "UDatepicker") {
    return comp.parent;
  }

  return comp;
}

// validation 대상에 검증 function을 세팅
function setTargetValidations(searchedEls) {
  searchedEls.forEach((el) => {
    const compProps = nuxtComponent.getVNodeProps(el, true) || {};

    // add validate function
    const rules: ValidationObjectRule[] = [];
    const customRules: ValidationRule[] = [];

    const comp = getVueComponent(el);
    let hasValidateFunction = false;

    // 컴포넌트에서 validate function expose 되었을 경우
    if (
      comp &&
      comp._?.exposed?.validate &&
      typeof comp._?.exposed?.validate === "function"
    ) {
      rules.push({
        type: "custom",
        handler: comp._?.exposed?.validate,
      });

      hasValidateFunction = true;
    } else {
      // add els
      const els = getValidationEls(el);
      el["_validationEls"] = els;

      customRules.push(...getValidationRules(el));

      customRules.forEach((rule) => rules.push(toObjectRule(rule)));

      if (!rules.some((rule) => rule.type === "required")) {
        if (compProps.isRequired || compProps.required) {
          rules.push(toObjectRule("required"));
        }
      }

      if (props.addElementValidationRule) {
        const addRules = props.addElementValidationRule(el, rules);

        if (addRules) {
          addRules.forEach((r) => rules.push(toObjectRule(r)));
        }
      }
    }

    const createValidator = (compOrEl, el, rules) => {
      return () => {
        if (!compOrEl) {
          return;
        }

        // timer 체크
        if (compOrEl.__validateTimer) {
          clearTimeout(compOrEl.__validateTimer);
        }

        return new Promise(async (resolve) => {
          compOrEl.__validateTimer = setTimeout(async () => {
            resolve(await validateEl(el, rules));
          }, 0);
        });
      };
    };

    if (comp) {
      const validator = createValidator(comp, el, rules);
      if (!hasValidateFunction) {
        nuxtComponent.getWrappedComponents(comp).forEach((comp) => {
          comp.proxy.validate = validator;
        });
      } else {
        nuxtComponent.getWrappedComponents(comp).forEach((comp) => {
          comp.proxy._validate = validator;
        });
      }

      if (!props.checkValidationOnUpdate) {
        comp._addedValidationEvent = false;
        if (comp.__validationWatch) {
          comp.__validationWatch();
          comp.__validationWatch = null;
        }

        if (el.__validationWatch) {
          el.removeEventListener("input", el.__validationWatch);
          el.__validationWatch = null;
        }

        return;
      }

      if (!comp._addedValidationEvent) {
        comp.__addedValidationEvent = true;

        if (comp.__validationWatch) {
          comp.__validationWatch();
          comp.__validationWatch = null;
        }

        const deps = getValidationDeps(comp);

        if (
          comp._ &&
          comp._.props &&
          (Object.hasOwn(comp._.props, "modelValue") ||
            Object.hasOwn(comp._.props, "value"))
        ) {
          comp.__validationWatch = comp.$watch(
            () => [comp._.props.modelValue, comp._.props.value, ...deps],
            () => {
              if (comp._validate) {
                comp._validate();
              } else {
                comp.validate();
              }
            },
            {
              deep: true,
            }
          );
        } else if (
          Object.hasOwn(comp, "modelValue") ||
          Object.hasOwn(comp, "value")
        ) {
          comp.__validationWatch = comp.$watch(
            () => [comp.modelValue, comp.value, ...deps],
            () => {
              if (comp._validate) {
                comp._validate();
              } else {
                comp.validate();
              }
            },
            {
              deep: true,
            }
          );
        } else if (comp.$attrs["onUpdate:modelValue"]) {
          comp.__validationWatch = comp.$watch(
            () => [comp.$attrs.modelValue, ...deps],
            () => {
              if (comp._validate) {
                comp._validate();
              } else {
                comp.validate();
              }
            },
            {
              deep: true,
            }
          );
        }
      }
    } else {
      el.validate = createValidator(el, el, rules);

      if (props.checkValidationOnUpdate) {
        if (!el._addedValidationEvent) {
          el.__addedValidationEvent = true;
          el.__validationWatch = () => el.validate();
          el.addEventListener("input", el.__validationWatch);
        }
      }
    }
  });
}

// element 내에서 validation rule을 조회
function getValidationRules(el) {
  const props = nuxtComponent.getVNodeProps(el, true) || {};

  return props?.validation?.rules || [];
}

// element 내에서 validation els를 조회
function getValidationEls(el) {
  const props = nuxtComponent.getVNodeProps(el, true) || {};

  if (!props.validation?.els) {
    return null;
  }

  const els =
    typeof props.validation.els === "function"
      ? props.validation.els()
      : props.validation.els;

  return Array.isArray(els) ? els : [els];
}

function getValidationDeps(el) {
  const deps = [];
  const props = nuxtComponent.getVNodeProps(el, true) || {};

  if (props.validation && props.validation.deps) {
    return props.validation.deps;
  }

  return deps;
}

// 대상 element 조회
function detectValidationTargetElements() {
  const searchedEls = [];
  getRootEls().forEach((rel) => {
    const els = dom.querySelectors(
      rel,
      (el) => {
        if (dom.isHidden(el)) {
          return false;
        }

        // validation group일 경우, 더이상 하위는 탐색하지 않는다.
        let comp = getWrappedComponent(el);
        if (comp?.type?.name === "UValidationGroup") {
          return "exclude";
        }

        // custom validate
        if (
          comp &&
          comp.exposed?.validate &&
          typeof comp.exposed?.validate === "function"
        ) {
          return true;
        }

        if (props.filterTargetElement) {
          const result = props.filterTargetElement(el);

          if (result !== undefined) {
            return result;
          }
        }

        // validation rule을 가지고 있다면 추가
        if (getValidationRules(el).length > 0) {
          return true;
        }

        // input tag일 경우
        if (el.tagName.toLowerCase() === "input") {
          const inputEl = el as HTMLInputElement;

          if (inputEl.type === "hidden" || inputEl.disabled) {
            return false;
          }

          return true;
        }

        // text area 태그일 경우
        return ["textarea", "select"].includes(el.tagName.toLowerCase());
      },
      !props.wrapContainer
    );
    searchedEls.push(...els);
  });

  setTargetValidations(searchedEls);
  return searchedEls;
}

// 대상 validation group 목록 조회
function targetChildValidationGroups() {
  return nuxtComponent.findChildComponentsByType(instance, "UValidationGroup");
  // const validationGroups = []

  // console.log('instance', instance)

  // getRootEls().forEach(rel => {
  //   dom.querySelectors(rel, el => {
  //     if (dom.isHidden(el)) {
  //       return false
  //     }

  //     const comp = getWrappedComponent(el)
  //     if (comp?.type?.name === 'UValidationGroup') {
  //       validationGroups.push(comp)
  //       return 'exclude'
  //     }
  //   })
  // }, !props.wrapContainer)

  // return validationGroups
}

/**
 * validation 수행
 * @param includeChildGroup 하위 UValidationGroup 포함 처리
 * @param focusFirst Validation 실패 시 첫번째 항목 auto focus 처리
 */
const validate = async (includeChildGroup = false, focusFirst = true) => {
  const validationResult = {
    /**
     * validate 성공 여부
     */
    isValid: true,

    /**
     * 실패 컴포넌트 목록
     */
    components: [],
  };

  // when disabled...
  if (props.disabled) {
    await init(includeChildGroup);
    return validationResult;
  }

  if (_isInitialized) {
    validationResult.isValid = false;
    return validationResult;
  }

  for (const el of detectValidationTargetElements()) {
    const targetEl = getTargetEl(el);

    const comp = getVueComponent(el);
    const validateFunction =
      comp?._validate ||
      comp?.validate ||
      targetEl._validate ||
      targetEl.validate;
    if (validateFunction) {
      const result = await validateFunction();

      if (result !== true) {
        validationResult.isValid = false;
        validationResult.components.push(result);
      }
    }
  }

  if (includeChildGroup) {
    for (const group of targetChildValidationGroups()) {
      const result = await group.exposed.validate();

      if (result?.isValid !== true) {
        validationResult.isValid = false;
        validationResult.components.push(...result.components);
      }
    }
  }

  // TODO: focus 로직 변경
  if (!validationResult.isValid && focusFirst) {
    if (validationResult.components[0]?.focus) {
      validationResult.components[0]?.focus();
    } else if (validationResult.components[0].exposed?.focus) {
      validationResult.components[0]?.exposed?.focus();
    } else if (validationResult.components[0].proxy?.focus) {
      validationResult.components[0].proxy?.focus();
    } else if (validationResult.components[0].proxy?.control?.focus) {
      validationResult.components[0].proxy?.control?.focus();
    } else if (validationResult.components[0].querySelector) {
      const el = validationResult.components[0].querySelector(
        "input,select,textaera"
      );
      if (el && el.focus) {
        el.focus();
      }
    } else {
      const el = validationResult.components[0].$el
        ? validationResult.components[0].$el
        : validationResult.components[0].proxy?.$el
          ? validationResult.components[0].proxy?.$el
          : validationResult.components[0];
      const focusableEl = $ustra.utils.dom.findFocusableEl(el);

      if (focusableEl) {
        focusableEl.focus();
      }
    }
  }

  return validationResult;
};

/**
 * validation 초기화
 * @param includeChildGroup 하위 UValidationGroup 포함 처리
 */
const init = async (includeChildGroup = false) => {
  updateLayout();
  for (const el of detectValidationTargetElements()) {
    initEl([el], el);
  }

  if (includeChildGroup) {
    for (const group of targetChildValidationGroups()) {
      await group.exposed.init();
    }
  }

  _isInitialized = true;

  if (_isInitializedTimer) {
    clearTimeout(_isInitializedTimer);
    _isInitializedTimer = null;
  }

  _isInitializedTimer = setTimeout(() => {
    _isInitialized = false;
  }, 500);
};

const updateLayout = () => {
  nextTick(() => {
    getRootEls().forEach((el) => {
      el.classList.remove("u-layout-state-disabled");

      if (props.wrapContainer) {
        el.classList.add(props.cssClassName);
      }

      if (props.disabled) {
        el.classList.add("u-layout-state-disabled");
      }
    });

    // Vuetify 등 일부 컴포넌트의 경우, CSS를 다시 세팅하므로 상위에 컴포넌트를 추가한다.
    if (!props.wrapContainer) {
      instance.proxy.$el.parentElement.classList.add(props.cssClassName);
    }
  });
};

watch(
  () => props.disabled,
  (v) => {
    if (v === true) {
      init(true);
    }
  }
);

onMounted(async () => {
  nextTick(() => init());
});

onUpdated(async () => {
  detectValidationTargetElements();
  updateLayout();
});

defineExpose({
  validate,
  init,
  initEl,
  getWrappedComponent,
  getVueComponent,
});
</script>

<script lang="ts">
export default {
  name: "UValidationGroup",
};
</script>

<style>
.ustra-validation-group .ustra-invalidate,
.ustra-validation-group.ustra-invalidate {
  border: 1px solid #bd0000;
  box-shadow:
    inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 7px rgba(255, 0, 0, 0.6);
}
</style>
