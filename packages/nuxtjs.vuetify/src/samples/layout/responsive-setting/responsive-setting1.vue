<template>
  <VCard>
    <template #text>
      <UMarkdownViewer :content="doc1" />
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { computed } from "#moong/nuxt";
import { UMarkdownViewer } from "#moong/nuxt/components";
import { useMediaQueryState } from "#moong/nuxt/composables";

// @ts-ignore
import doc1 from "./md/responsive-setting1.md";
</script>
