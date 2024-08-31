<template>
  <VCard>
    <template #title><h5>기본 사용법</h5></template>
    <template #text>
      콤보 박스와 동일한 형태로 grpCd 속성을 입력하여 radio 버튼을 코드 목록만큼
      노출할 수 있다.

      <div class="mt-2 mb-5">
        <UVCodeRadioGroupBox
          v-model="radioValue"
          v-model:objectValue="radioObjectValue"
          grpCd="SYS_CD"
        />
        <!-- <UCodeRadioGroupBox v-model="radioValue" v-model:objectValue="radioObjectValue" grpCd="SYS_CD" /> -->
      </div>

      <!-- <uVRadioGroupBox v-model="radioValue" grpCd="SYS_CD" />
      <uVCodeRadioGroupBox v-model="radioValue" :itemsSource="radioItems" /> -->
      <!-- <uVCodeRadioGroupBox v-model="radioValue" :itemsSource="radioItems" grpCd="SYS_CD" /> -->

      <v-chip class="ma-2" color="pink" label text-color="white">
        <v-icon start icon="mdi-label"></v-icon>
        radioValue : {{ radioValue }}
      </v-chip>
      <v-chip class="ma-2" color="pink" label text-color="white">
        <v-icon start icon="mdi-label"></v-icon>
        radioObjectValue : {{ radioObjectValue }}
      </v-chip>

      <!-- <UMarkdownViewer :content="radio1" /> -->
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { ref, reactive } from "#moong/nuxt";
import UVCodeRadioGroupBox from "#moong/nuxt-vuetify/management/components/radio/u-v-code-radio-group-box.vue";

// @ts-ignore
import radio1 from "./md/radio1.md";

const radioValue = ref(null);
const radioObjectValue: any[] = ref(null);
const radioItems = reactive([
  { value: "1", text: "radio1" },
  { value: "2", text: "radio2", disabled: true },
  { value: "3", text: "radio3" },
]);
</script>
