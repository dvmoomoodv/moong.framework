<template>
  <VCard>
    <template #text>
      <!-- <UMarkdownViewer :content="doc1" /> -->
      <render />
      <renderPopup />

      <VBtn @click="() => (showPopup = true)">Open Popup</VBtn>
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { ref, getCurrentInstance, h } from "#moong/nuxt";
import RenderPopup from "./popup/render-popup.vue";

// @ts-ignore
import doc1 from "./md/rendering1-1.md";

// @ts-ignore
import doc2 from "./md/rendering2-2.md";

const render = () => {
  return h(VBtn, {
    text: "렌더링된 버튼",
    onClick() {
      alert("버튼 클릭");
    },
  });
};

const showPopup = ref(false);
const renderPopup = () => {
  return h(RenderPopup, {
    modelValue: showPopup.value,
    "onUpdate:modelValue"(value) {
      showPopup.value = value;
    },
  });
};
</script>
