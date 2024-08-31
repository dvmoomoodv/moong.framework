<template>
  <VCard>
    <template #text>
      disabled 속성을 사용하여 버튼을 비활성화 할 수 있다.
      <br /><br />
      <UFileButton :disabled="disabledButton"></UFileButton>
      <br />
      <VBtn class="mt-2" @click="() => (disabledButton = !disabledButton)">Toggle Button</VBtn>

      <!-- <UMarkdownViewer :content="button4" /> -->
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { ref } from '#ustra/nuxt'

// @ts-ignore
import button4 from './md/button4.md'

const disabledButton = ref(false)
</script>
