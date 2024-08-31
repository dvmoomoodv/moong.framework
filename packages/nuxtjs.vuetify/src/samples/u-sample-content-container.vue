<template>
  <VCard>
    <template #text>
      <h3 class="mb-4" v-if="props.title">
        {{ props.title }}
      </h3>
      <slot />
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { defineProps } from "#moong/nuxt";

const props = defineProps<{
  title?: string;
}>();
</script>
<script lang="ts">
export default {
  name: "USampleContentContainer",
};
</script>
