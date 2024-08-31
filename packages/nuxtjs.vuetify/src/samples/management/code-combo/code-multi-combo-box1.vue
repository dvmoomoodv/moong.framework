<template>
  <v-card>
    <template #title> 공통코드 Multi 콤보 박스 </template>

    <template #text>
      <uVCodeMultiComboBox :grpCd="grpCd" v-model="comboValue" v-model:objectValue="comboObjectValue" style="width: 500px" />
      <div>
        <v-chip class="ma-2" color="pink" label text-color="white">
          <v-icon start icon="mdi-label"></v-icon>
          comboValue : {{ comboValue }}
        </v-chip>
        <v-chip class="ma-2" color="pink" label text-color="white" style="height: auto; overflow: auto; white-space: normal">
          <v-icon start icon="mdi-label"></v-icon>
          comboObjectValue : {{ comboObjectValue }}
        </v-chip>
      </div>
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from '#ustra/nuxt'
import { useUstraCodeList } from '#ustra/nuxt/management/composables'
import { UMarkdownViewer } from '#ustra/nuxt/components'

import uVCodeMultiComboBox from '#ustra/nuxt-vuetify/management/components/combo-box/u-v-code-multi-combo-box.vue'

// @ts-ignore
import desc from './md/code-multi-combo-box1.md'

const comboValue = ref<string[]>([])
const comboObjectValue = ref(null)
const grpCd = ref('SYS_CD')

function changeComboValue() {
  const codes = useUstraCodeList(grpCd.value, true)

  if (codes.length > 0) {
    comboValue.value = [codes[codes.length - 1].dtlCd]
  }
}
</script>
<script lang="ts">
export default {
  name: 'CodeMultiComboBox',
}
</script>
