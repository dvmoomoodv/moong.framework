<template>
  <VCard>
    <template #text>
      <h3>다중 선택 예제</h3>
      <br />
      <VBtn @click="() => (showPopup = true)"></VBtn>
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
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { ref } from "#moong/nuxt";
import UVMenuPopup from "#moong/nuxt-vuetify/management/components/popup/u-v-menu-popup.vue";

// @ts-ignore
import doc1 from "./md/menu-popup2.md";

const showPopup = ref(false);
const selectedItem = ref(null);
</script>
