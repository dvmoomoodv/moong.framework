<template>
  <VCard>
    <template #text>
      <h3>Dynamic mount</h3>
      <!-- <UMarkdownViewer :content="doc1" /> -->

      <VBtn @click="() => renderButton()">Render Button</VBtn>
      <VBtn @click="() => destoryButton()">Destory</VBtn>
      <div ref="renderEl" class="mt-2"></div>

      <!-- <UMarkdownViewer :content="doc2" /> -->
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { ref, getCurrentInstance } from '#ustra/nuxt'

// @ts-ignore
import doc1 from './md/rendering3-1.md'

// @ts-ignore
import doc2 from './md/rendering3-2.md'

const renderEl = ref()
const instance = getCurrentInstance()

const { renderButton, destoryButton } = (() => {
  const destoryFn = ref<() => void>(null)
  function renderButton() {
    const { destroy } = $ustra.utils.component.mount(UButton, instance, {
      element: renderEl.value,
      props: {
        text: '렌더링된 버튼',
        onClick() {
          alert('버튼 클릭')
        },
      },
    })
    destoryFn.value = destroy
  }

  return { renderButton, destoryButton: destoryFn }
})()
</script>
