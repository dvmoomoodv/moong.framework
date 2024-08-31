<template>
  <VCard>
    <template #text>
      <UBaseDatepicker v-model="value" />
      <UBaseDatepicker v-model="value" pattern="\d{4}.\d{2}.\d{2}" />
      <UBaseDatepicker v-model="value" pattern="\d{4}.\d{2}.\d{2}" />
      <UBaseDatepicker v-model="datetimeValue" type="datetime-local" />
      <UBaseDatepicker v-model="monthValue" type="month" />
      <UBaseDatepicker v-model="weekValue" type="week" />
      <UBaseDatepicker v-model="timeValue" type="time" />
      {{ value }}<br />
      {{ datetimeValue }}<br />
      {{ monthValue }}<br />
      {{ weekValue }}<br />
      {{ timeValue }}<br />
      <!-- type date : <input type="date" /> <br />
      type datetime-local : <input type="datetime-local" /><br />
      type month : <input type="month" /><br />
      type week : <input type="week" /><br />
      type time : <input type="time" /><br /> -->
      <hr />
      <hr />
      <hr />
      <hr />
      <!-- <UMarkdownViewer :content="doc1" /> -->
      <!-- :utc="true" -->
      <!-- <VueDatePicker v-model="value" :timezone="timezone" /> -->
      <UDatepicker v-model="value" value-type="format" format="YYYY-MM-DD" />
      <!-- <UDatepicker v-model="value" scrollLock /> -->
      <v-chip class="ma-2" color="pink" label text-color="white">
        <v-icon start icon="mdi-label"></v-icon>
        value : {{ value }}
        <!-- timezone : {{ utcDate }} -->
      </v-chip>

      <!-- <UMarkdownViewer :content="doc2" /> -->
      <!-- <div style="margin: 500px"></div> -->
      <VBtn @click="setDate('2000-01-01')">2000년 1월 1일</VBtn>
      <VBtn @click="setDate('now')">now</VBtn>
      <VBtn @click="setDate(null)">null</VBtn>
    </template>
  </VCard>

  <VCard class="mt-5">
    <template #text>
      <UDatepicker v-model="value" inline auto-apply />
    </template>
  </VCard>

  <VCard class="mt-5">
    <template #text>
      <UDatepicker v-model="value" text-input />
    </template>
  </VCard>

  <VCard class="mt-5">
    <template #text>
      <UDatepicker v-model="rangeValue" range multi-calendars />
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { ref } from '#ustra/nuxt'
import { UMarkdownViewer } from '#ustra/nuxt/components'
import UDatepicker from '#ustra/nuxt-vuetify/components/datepicker/u-datepicker.vue'
// import Datepicker from '@vuepic/vue-datepicker'
import { ko } from 'date-fns/locale'

// @ts-ignore
import doc1 from './md/datepicker1-1.md'

// @ts-ignore
import doc2 from './md/datepicker1-2.md'
import UBaseDatepicker from '#ustra/nuxt-vuetify/components/datepicker/u-base-datepicker.vue'

const value = ref('2023-01-01')
const datetimeValue = ref('2018-06-12T19:30')
const monthValue = ref('2021-02')
const weekValue = ref('2018-W18')
const timeValue = ref('13:30')

const rangeValue = ref(null)

const setDate = date => {
  if (date === 'now') {
    value.value = new Date()
    return
  }
  value.value = date
}

// const utcDate = ref()

// const setUTCDate = value => {
//   utcDate.value = value
// }

// const timezone = ref({
//   timezone: 'Asia/Seoul',
//   exactMatch: true,
//   dateInTz: 'Asia/Seoul',
//   emitTimezone: 'Asia/Seoul',
// })
</script>
