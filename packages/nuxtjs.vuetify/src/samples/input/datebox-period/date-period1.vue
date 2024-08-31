<template>
  <v-card>
    <template #text>
      UVDatePeriodBox 컴포넌트를 사용하여 일자 기간 입력을 처리할 수 있다. <br /><br />
      <div class="samplebox">
        <UVDatePeriodBox v-model="dateArr1" />
        <div>
          <v-chip class="ma-2" color="pink" label text-color="white">
            <v-icon start icon="mdi-label"></v-icon>
            dateArr1 : {{ dateArr1 }}
          </v-chip>
        </div>
        <VBtn text="배열 일자 반영" @click="dateArr1 = ['20220507', '20221009']"></VBtn>
        <VBtn text="배열 null 반영" @click="dateArr1 = [null, null]"></VBtn>
      </div>
      <UMarkdownViewer>{{ doc1 }}</UMarkdownViewer>
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { UMarkdownViewer } from '#ustra/nuxt/components'

// @ts-ignore
import doc1 from './md/date-period1.md'
import UVDatePeriodBox from '#ustra/nuxt-vuetify/components/date-period/u-v-date-period-box.vue';

// const start = ref('20220507')
// const end = ref('20220508')
const dateArr1 = ref(['20220507', '20220508'])
</script>
<style scoped>
.samplebox {
  margin-bottom: 30px;
}
</style>
