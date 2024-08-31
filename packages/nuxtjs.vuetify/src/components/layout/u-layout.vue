<template>
  <v-container
    :class="classes"
    :style="[headerStyle, { display: 'flex', flexDirection: 'column' }]"
    :id="id"
    :tag="tag"
    :fluid="fluid"
    ><slot
  /></v-container>
</template>

<script setup lang="ts">
import { defineProps, computed, useAttrs } from "#moong/nuxt";
import { dom } from "#moong/core/utils/browser";
import "./styles/layout.scss";

// v-container
const props = defineProps({
  fluid: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: undefined,
  },
  tag: {
    type: String,
    default: "div",
  },
  height: {
    type: [Number, String],
    default: "100%",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const classes = computed(() => {
  if (props.disabled) return "u-layout-state-disabled";
});
const headerStyle = computed(() => {
  return " min-height: " + dom.getCssUnit(props.height) + ";";
});

// const heightStyle = ' min-height: ' + dom.getCssUnit(props.height) + ';'
// const uLayoutStyle = heightStyle
</script>

<style scoped>
.u-layout {
  padding: 0;
}
</style>
