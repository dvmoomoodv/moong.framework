<template>
  <p class="desc_txt" :class="classes">
    <template v-if="$slots.default">
      <slot />
    </template>
    <template v-if="!$slots.default">
      {{ message }}
    </template>
  </p>
</template>

<script setup lang="ts">
import { computed } from "#moong/nuxt";
const props = defineProps({
  type: {
    type: String,
    default: "info",
  },
  message: { type: String, default: "" },
});
const classes = computed(() => {
  return props.type;
});
</script>

<style scoped></style>
