<template>
  <v-card>
    <template #title> 공통코드 팝업 </template>
    <template #subtitle
      >UCodePopup 컴포넌트를 사용하여 코드 목록을 팝업을 통해 선택할 수 있다.
      <br />
      코드 선택이 완료되면 selected 이벤트가 발생되며 첫번째 인자 값으로 선택된
      코드 정보가 반환된다.</template
    >
    <template #text>
      <VBtn text="" @click="showPopup = true">팝업 오픈</VBtn>
      <UVCodePopup
        grpCd="SYS_CD"
        v-model="showPopup"
        @selected="(item) => (selectedItem = item)"
      />
      <br />
      <v-chip class="ma-2" color="pink" label text-color="white">
        <v-icon start icon="mdi-label"></v-icon>
        selectedItem : {{ selectedItem }}
      </v-chip>

      <UMarkdownViewer :content="codePopup1"></UMarkdownViewer>
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from "#moong/nuxt";
import { UMarkdownViewer } from "#moong/nuxt/components";
import UVCodePopup from "#moong/nuxt-vuetify/management/components/popup/u-v-code-popup.vue";

// @ts-ignore
import codePopup1 from "./md/code-popup1.md";

const showPopup = ref(false);
const selectedItem = ref(null);
</script>
