<template>
  <v-card>
    <template #title> Link </template>
    <!-- <template #subtitle> type 및 색상 변경 </template> -->
    <template #subtitle>vuetify typography 항목을 확인하여 적용한다. https://vuetifyjs.com/en/styles/text-and-typography</template>
    <template #text>
      <ULink message="Page Link" href="/" target="_blank" /> <br />
      <ULink type="blue" message="Page Link" href="/" target="_blank" /> <br />
      <ULink type="gray" message="Page Link" href="/" target="_blank" /> <br />
      <ULink color="#ff0000" message="Page Link" href="/" target="_blank" />
      <!-- <UMarkdownViewer>{{ base3 }}</UMarkdownViewer> -->
    </template>
  </v-card>
</template>

<script setup lang="ts">
// @ts-ignore
import base3 from './md/base3.md'
</script>

<style scoped></style>
