<template>
  <v-card>
    <template #text>
      <h3>displayFormat, valueFormat</h3>
      displayFormat으로 날짜 표시 포맷을 지정하고, valueFormat로 저장 될 날짜의 포맷을 변경 할 수 있다. <br /><br />
      <div class="samplebox">
        <UVDatePeriodBox v-model="dateArr6" mode="datetime" displayFormat="yyyy/MM/dd" valueFormat="yyyyMMdd" />
        <v-chip class="ma-2" color="pink" label text-color="white">
          <v-icon start icon="mdi-label"></v-icon>
          dateArr6 : {{ dateArr6 }}
        </v-chip>
      </div>
      <UMarkdownViewer>{{ doc3 }}</UMarkdownViewer>
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { UMarkdownViewer } from '#ustra/nuxt/components'
// @ts-ignore
import doc3 from './md/date-period3.md'
import UVDatePeriodBox from '#ustra/nuxt-vuetify/components/date-period/u-v-date-period-box.vue';

const dateArr6 = ref(['20220507', '20221009'])

// const dateValues = reactive({
//   start: new Date(),
//   end: new Date(),
// })
</script>
<style scoped>
.samplebox {
  margin: 20px 0;
}
</style>
