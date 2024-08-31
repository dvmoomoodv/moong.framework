<template>
  <v-card>
    <template #title></template>
    <template #subtitle>https://vuetifyjs.com/en/components/radio-buttons/#model-group </template>
    <template #text>
      <!-- <UMarkdownViewer :content="radio1_1" /> -->
      <!-- <URadioGroupBox v-model="radioValue" :itemsSource="radioItems" /> -->

      <v-radio-group v-model="ex7" column>
        <v-radio color="red" label="red" value="red"></v-radio>
        <v-radio color="red-darken-3" label="red-darken-3" value="red-darken-3" disabled></v-radio>
        <v-radio color="indigo" label="indigo" value="indigo"></v-radio>
        <v-radio color="indigo-darken-3" label="indigo-darken-3" value="indigo-darken-3"></v-radio>
        <v-radio color="orange" label="orange" value="orange"></v-radio>
        <v-radio color="orange-darken-3" label="orange-darken-3" value="orange-darken-3"></v-radio>
      </v-radio-group>
      <v-radio-group v-model="ex8" column>
        <v-radio color="primary" label="primary" value="primary"></v-radio>
        <v-radio color="secondary" label="secondary" value="secondary"></v-radio>
        <v-radio color="success" label="success" value="success"></v-radio>
        <v-radio color="info" label="info" value="info"></v-radio>
        <v-radio color="warning" label="warning" value="warning"></v-radio>
        <v-radio color="error" label="error" value="error"></v-radio>
      </v-radio-group>

      <v-chip class="ma-2" color="pink" label text-color="white">
        <v-icon start icon="mdi-label"></v-icon>
        <!-- radioValue : {{ radioValue }} -->
      </v-chip>

      <!-- <UMarkdownViewer :content="radio1_2" /> -->
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref, reactive } from '#ustra/nuxt'
import { UMarkdownViewer } from '#ustra/nuxt/components'

// @ts-ignore
import radio1_1 from './md/radio1-1.md'
// @ts-ignore
import radio1_2 from './md/radio1-2.md'

const ex7 = ref('red')
const ex8 = ref('info')

// const radioItems = reactive([
//   { value: '1', text: 'radio1' },
//   { value: '2', text: 'radio2', disabled: true },
//   { value: '3', text: 'radio3' },
// ])

// const radioValue = ref('1')
</script>
