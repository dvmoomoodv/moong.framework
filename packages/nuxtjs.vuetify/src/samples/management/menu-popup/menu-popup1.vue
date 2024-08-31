<template>
  <VCard>
    <template #text>
      UMenuPopup 컴포넌트를 사용하여 메뉴 목록을 팝업을 통해 선택할 수 있다.
      <br /><br />
      <!-- <UMarkdownViewer :content="doc1" /> -->
      <br /><br />

      <h3>단일 선택 예제</h3>
      <br />
      <VBtn @click="() => (showPopup = true)">팝업오픈</VBtn>
      <UVMenuPopup
        v-model="showPopup"
        :multiple="true"
        @selected="(data) => (selectedItem = data)"
      />

      <br />
      <VChip
        class="ma-2 pa-2"
        color="pink"
        label
        text-color="white"
        style="height: auto; overflow: auto; white-space: normal"
      >
        <VIcon start icon="mdi-label"></VIcon>
        selectedItem : {{ selectedItem }}
      </VChip>

      <!-- <UMarkdownViewer :content="doc2" /> -->
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { ref } from "#moong/nuxt";
import UVMenuPopup from "#moong/nuxt-vuetify/management/components/popup/u-v-menu-popup.vue";

// @ts-ignore
import doc1 from "./md/menu-popup1-1.md";

// @ts-ignore
import doc2 from "./md/menu-popup1-2.md";

const showPopup = ref(false);
const selectedItem = ref(null);
</script>
