<template>
  <div class="u-toolbar-item">
    <span v-if="title">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: null,
  },
})
</script>

<style scoped></style>
