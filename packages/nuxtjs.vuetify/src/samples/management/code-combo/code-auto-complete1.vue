<template>
  <v-card>
    <template #title> 공통코드 Auto Complete </template>

    <template #text>
      <uVCodeAutoComplete
        :grpCd="grpCd"
        v-model="comboValue"
        v-model:objectValue="comboObjectValue"
        style="width: 500px"
      ></uVCodeAutoComplete>

      <div>
        <v-chip class="ma-2" color="pink" label text-color="white">
          <v-icon start icon="mdi-label"></v-icon>
          comboValue : {{ comboValue }}
        </v-chip>
        <v-chip
          class="ma-2"
          color="pink"
          label
          text-color="white"
          style="height: auto; overflow: auto; white-space: normal"
        >
          <v-icon start icon="mdi-label"></v-icon>
          comboObjectValue : {{ comboObjectValue }}
        </v-chip>
      </div>
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from "#moong/nuxt";
import { UMarkdownViewer } from "#moong/nuxt/components";
import { useUstraCodeList } from "#moong/nuxt/management/composables";

import uVCodeAutoComplete from "#moong/nuxt-vuetify/management/components/combo-box/u-v-code-auto-complete.vue";

// @ts-ignore
import desc from "./md/code-auto-complete1.md";

const comboValue = ref<string>();
const comboObjectValue = ref(null);
const grpCd = ref("SYS_CD");

function changeComboValue() {
  const codes = useUstraCodeList(grpCd.value, true);

  if (codes.length > 0) {
    comboValue.value = codes[codes.length - 1].dtlCd;
  }
}
</script>
<script lang="ts">
export default {
  name: "CodeAutoComplete",
};
</script>
