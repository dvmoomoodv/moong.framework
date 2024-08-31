<template>
  <VTextField
    ref="textControl"
    v-bind="attrs"
    v-model="modelValue"
    maxlength="14"
    type="tel"
    @keydown="(e) => $ustra.utils.event.onlyNumberOnKeydown(e)"
    @input="formatValue"
    @blur="formatValue"
    @focus="formatValue"
    :validation="{
      els: () => textControl.$el.querySelector('input'),
      rules: [checkValidation],
    }"
  />
</template>
<script lang="ts" setup>
import { VTextField } from "vuetify/components";
import {
  computed,
  useAttrs,
  defineProps,
  nextTick,
  shallowRef,
  withDefaults,
} from "#moong/nuxt";
import { validation } from "#moong/core/utils";
import { useVModel } from "@vueuse/core";

const textControl = shallowRef<InstanceType<typeof VTextField>>();
const inputEl = computed(
  () => textControl.value.$el.querySelector("input") as HTMLInputElement
);

const props = withDefaults(
  defineProps<{
    modelValue: string | null;

    /**
     * 필수 여부
     */
    required?: boolean;

    /**
     * 휴대폰 번호만 입력 가능 여부
     */
    onlyMobileNo?: boolean;
  }>(),
  {
    onlyMobileNo: false,
  }
);
const modelValue = useVModel(props, "modelValue");

const attrs = computed(() => {
  const $attrs = useAttrs();
  return $attrs;
});

function checkValidation() {
  if (attrs.value.disabled) {
    return true;
  }

  let value = (modelValue.value as string) || "";

  if (props.required) {
    if (!value) {
      return "필수 입력입니다.";
    }
  }

  if (props.onlyMobileNo) {
    if (!!value && !validation.mobileNo(value)) {
      return "유효하지 않은 휴대폰 번호입니다.";
    }
  } else {
    if (!!value && !validation.phoneNo(value)) {
      return "유효하지 않은 전화 번호입니다.";
    }
  }

  return true;
}

function formatValue(e) {
  if (
    e.inputType === "insertText" ||
    e.inputType === "insertFromPaste"
    // e.inputType === 'deleteContentBackward' ||
    // e.inputType === 'deleteContentForward'
  ) {
    nextTick(() => {
      // const selectionStart = inputEl.value.selectionStart

      let value = e.target.value.replace(/[^0-9]/g, "").replace(/-/g, "");

      if (value.length >= 2 && value.substring(0, 2) === "02") {
        value = value.substring(0, 2) + "-" + value.substring(2);
      } else if (
        value.length >= 3 &&
        !value.startsWith("050") &&
        !value.startsWith("15") &&
        !value.startsWith("16")
      ) {
        value = value.substring(0, 3) + "-" + value.substring(3);
      } else if (
        value.length >= 4 &&
        (value.startsWith("050") ||
          value.startsWith("15") ||
          value.startsWith("16"))
      ) {
        value = value.substring(0, 4) + "-" + value.substring(4);
      }

      if (value.indexOf("-") < 0) {
        modelValue.value = value;
        return;
      }
      const orgValue = value.substring(0, value.indexOf("-") + 1);
      const restValue = value.substring(value.indexOf("-") + 1);

      if (restValue.length < 3) {
        modelValue.value = value;
        return;
      }

      if (restValue.length === 3 || restValue.length === 4) {
        value = orgValue + restValue + "-";
      } else if (restValue.length < 8) {
        value =
          orgValue + restValue.substring(0, 3) + "-" + restValue.substring(3);
      } else if (restValue.length >= 8) {
        value =
          orgValue + restValue.substring(0, 4) + "-" + restValue.substring(4);
      }

      modelValue.value = value;

      // if (e.inputType === 'insertText') {
      //   setTimeout(() => {
      //     inputEl.value.setSelectionRange(selectionStart + 1, selectionStart + 1)
      //   }, 1)
      // }
    });
  }
}
</script>
<script lang="ts">
export default {
  name: "UPhoneNoBox",
};
</script>
