<template>
  <v-card>
    <template #subtitle
      >displayNullText 속성으로 null 값을 가진 항목을 추가할 수 있다.
    </template>
    <template #text>
      <uVCodeComboBox
        grpCd="SYS_CD"
        v-model="comboValue"
        displayNullText="전체"
      />
      <div>
        <v-chip class="ma-2" color="pink" label text-color="white">
          <v-icon start icon="mdi-label"></v-icon>
          comboValue : {{ comboValue }}
        </v-chip>
      </div>
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from '#moong/nuxt'
import { UMarkdownViewer } from '#moong/nuxt/components'
import uVCodeComboBox from #moong/nuxt-vuetifys/app/ui/management/combo-box/u-v-code-combo-box.vue'
// @ts-ignore
import desc from './md/code-combo-box2.md'

const comboValue = ref(null)
</script>
