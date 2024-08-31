<template>
  <div class="u-field-row" ref="uFieldRow">
    <div class="u-field-grid-box" :class="classes" :style="styles">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults, useSlots, onMounted, ref } from "#moong/nuxt";
import { useMediaQueryState } from "#moong/nuxt/composables";
import { dom } from "#moong/core/utils/browser";
import "./styles/form.scss";
const props = withDefaults(
  defineProps<{
    /**
     * 비활성화 여부
     */
    disabled?: boolean;

    /**
     * 하위 배치 비율
     */
    ratio?: (number | string)[];
  }>(),
  {
    disabled: false,
    ratio: () => [],
  }
);
/**
 * 컴포넌트 최상위 태그 참조
 */
const uFieldRow = ref(null);
/**
 * u-fiels-set 반응형 설정여부 체크
 */
const isResponsive = ref(false);
onMounted(() => {
  isResponsive.value =
    uFieldRow.value.parentElement.parentElement.classList.value.includes(
      "u-field-set-responsive"
    );
});

const classes = computed(() => {
  if (props.disabled) return "u-form-state-disabled";
});

let slotLength = useSlots()
  .default()
  .filter((item) => typeof item.type !== "symbol").length;

const styles = computed(() => {
  const obj: Record<string, any> = {};
  if (isResponsive.value && useMediaQueryState().XS) {
    obj.gridTemplateColumns = `repeat(auto-fill, minmax(var(--u-field-set-responsive-base-width), 1fr)) !important`;
  } else {
    setRowRatio(obj);
  }
  return obj;
});

const setRowRatio = (obj) => {
  if (props.ratio.length === 0) {
    obj.gridTemplateColumns = `repeat(${slotLength} , 1fr)`;
  } else {
    let ratioString = "";
    props.ratio.forEach(function (value) {
      if (typeof value === "number") {
        /**
         * 숫자일때 비율
         */
        ratioString += value + "fr ";
      } else {
        /**
         * 숫자가 아닐때는 단위 적용
         */
        ratioString += dom.getCssUnit(value) + " ";
      }
    });
    obj.gridTemplateColumns = ratioString;
  }
  return obj;
};
</script>

<style scoped lang="scss">
.u-field-row {
  border-bottom: 1px solid #e9e9e9;
}
.u-field-grid-box {
  display: grid;
  gap: 0px;
}
</style>
