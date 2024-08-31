<template>
  <v-col
    :class="classes"
    :align-self="alignSelf"
    :cols="cols"
    :xl="xl"
    :lg="lg"
    :md="md"
    :sm="sm"
    :offset="offset"
    :offset-xl="offsetXl"
    :offset-lg="offsetLg"
    :offset-md="offsetMd"
    :offset-sm="offsetSm"
    :order="order"
    :order-xl="orderXl"
    :order-lg="orderLg"
    :order-md="orderMd"
    :order-sm="orderSm"
    ><slot
  /></v-col>
</template>

<script setup lang="ts">
import { computed, defineOptions, PropType } from "#moong/nuxt";
import "./styles/layout.scss";

defineOptions({
  name: "UCol",
});

// v-col
const props = defineProps({
  style: {
    type: String,
    default: "",
  },
  class: {
    type: String,
    default: "",
  },
  alignSelf: {
    type: String as PropType<
      "auto" | "center" | "end" | "start" | "stretch" | "baseline" | undefined
    >,
    default: undefined,
  },
  cols: {
    type: [Boolean, String, Number],
    default: false,
  },
  xl: {
    type: [Boolean, String, Number],
    default: false,
  },
  lg: {
    type: [Boolean, String, Number],
    default: false,
  },
  md: {
    type: [Boolean, String, Number],
    default: false,
  },
  sm: {
    type: [Boolean, String, Number],
    default: false,
  },
  width: {
    type: [Number, String],
    default: 0,
  },
  height: {
    type: [Number, String],
    default: 0,
  },
  offset: {
    type: [String, Number],
    default: undefined,
  },
  offsetXl: {
    type: [String, Number],
    default: undefined,
  },
  offsetLg: {
    type: [String, Number],
    default: undefined,
  },
  offsetMd: {
    type: [String, Number],
    default: undefined,
  },
  offsetSm: {
    type: [String, Number],
    default: undefined,
  },
  order: {
    type: [String, Number],
    default: undefined,
  },
  orderXl: {
    type: [String, Number],
    default: undefined,
  },
  orderLg: {
    type: [String, Number],
    default: undefined,
  },
  orderMd: {
    type: [String, Number],
    default: undefined,
  },
  orderSm: {
    type: [String, Number],
    default: undefined,
  },
  fillColumn: {
    type: Boolean,
    default: false,
  },
  fillRow: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const classes = computed(() => {
  if (props.disabled) return "u-layout-state-disabled";
});

//#region style
let widthStyle = "";
let heightStyle = "";
let heightClass = "";
if (props.width !== 0) {
  widthStyle =
    " width : " +
    props.width +
    "px; min-width: " +
    props.width +
    "px; flex-grow: 0;";
}
if (props.height !== 0) {
  heightStyle =
    " height : " + props.height + "px; min-height: " + props.height + "px;";
}
//#endregions
//#region fillColumn fillRow
let fillStyle = "";
if (props.fillColumn) {
  fillStyle = " display: flex; flex-direction: column; ";
}
if (props.fillRow) {
  fillStyle = " display: flex; flex-direction: row; ";
}
//#endregion

// const uItemStyle = props.style + widthStyle + heightStyle + fillStyle
// const uItemClass = 'u-item ' + props.class + heightClass
</script>

<style scoped>
.u-item {
  padding: 0;
  display: flex;
}

.u-layout .v-row > .u-item > * {
  flex-grow: 1;
}
</style>
