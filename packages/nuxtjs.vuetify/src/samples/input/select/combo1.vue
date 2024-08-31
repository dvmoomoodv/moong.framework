<template>
  <VCard>
    <template #title><h5>기본 사용법</h5></template>
    <template #text>
      <!-- <UMarkdownViewer :content="combo1_1" /> -->

      <WjComboBox :itemsSource="items" selectedValuePath="value" displayMemberPath="text" />

      <v-combobox label="Combobox" :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"></v-combobox>

      <!-- <UMarkdownViewer :content="combo1_2" /> -->
    </template>
  </VCard>
</template>
<script lang="ts" setup>
// @ts-ignore
import combo1_1 from './md/combo1-1.md'
// @ts-ignore
import combo1_2 from './md/combo1-2.md'

const items = [
  { value: '01', text: '항목1' },
  { value: '02', text: '항목2' },
]
</script>
