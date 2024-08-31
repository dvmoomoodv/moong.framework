<template>
  <div class="u-box" :class="classes" :style="styles"><slot /></div>
</template>

<script lang="ts">
export interface UBoxProps {
  /**
   * 높이
   */
  height?: number | string;

  /**
   * 비활성화 여부
   */
  disabled?: boolean;

  /**
   * 방향
   */
  direction?: "col" | "row";

  /**
   * 반응형 여부
   */
  responsive?: boolean;

  /**
   * 반응형시 기준 너비
   */
  responsiveBaseWidth?: number | string;
}
</script>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  withDefaults,
  defineOptions,
} from "#moong/nuxt";
import { dom } from "#moong/core/utils/browser";
import "./styles/layout.scss";

defineOptions({
  name: "UBox",
});

const props = withDefaults(defineProps<UBoxProps>(), {
  height: "100%",
  disabled: false,
  direction: "col",
  responsive: () => {
    return $ustra.components.getComponentsOption("responsive").enabled;
  },
  responsiveBaseWidth: 400,
});

const classes = computed(() => {
  let returnClasses = "";
  if (props.disabled) {
    returnClasses += "u-layout-state-disabled";
  }
  if (props.responsive) {
    returnClasses += "u-box-responsive";
  }

  return returnClasses;
});
const styles = computed(() => {
  const obj: Record<string, any> = {};

  /**
   * 반응형 지정
   */
  if (props.responsive) {
    obj["--u-box-responsive-base-width"] = dom.getCssUnit(
      props.responsiveBaseWidth
    );
  }

  /**
   * Direction 지정
   */
  if (props.direction === "row") {
    obj.flexDirection = "row";
  } else {
    obj.flexDirection = "column";
    obj.justifyContent = "flex-start";
    obj.alignItems = "stretch";
  }

  /**
   * 높이지정
   */
  if (props.height !== 0) {
    obj.height = dom.getCssUnit(props.height);
    obj.minHeight = dom.getCssUnit(props.height);
  }

  return obj;
});
</script>

<style lang="scss" scoped>
.u-box {
  display: flex;
  flex-grow: 1;
  flex-basis: 0px;
  flex-wrap: nowrap;
  &.u-box-responsive {
    flex-wrap: wrap;
  }
}
</style>
