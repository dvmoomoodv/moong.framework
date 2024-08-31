<template>
  <div class="u-button-bar-container" :style="styles" v-bind="$attrs">
    <span class="u-button-bar-title" v-if="title">{{ title }}</span>
    <slot name="default" />
    <div class="u-button" v-if="$slots.button"><slot name="button" :title="title" /></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '#ustra/nuxt'
const props = defineProps({
  title: {
    type: String,
    default: null,
  },
  backgroundColor: {
    type: String,
    default: '#f8f8f8',
  },
})
const styles = computed(() => {
  const obj: Record<string, any> = {}
  obj.backgroundColor = props.backgroundColor
  return obj
})
</script>

<style scoped>
.u-button-bar-container {
  margin: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  position: relative;
  width: 100%;
}
.u-button-bar-title {
  font-weight: bold;
  padding: 0px 1rem;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  line-height: 2;
}
</style>
