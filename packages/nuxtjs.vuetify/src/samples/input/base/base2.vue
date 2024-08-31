<template>
  <v-card>
    <template #title> 버튼 - 기본속성</template>
    <!-- <template #subtitle> type 속성 (primary, gray)</template> -->
    <template #subtitle>vuetify typography 항목을 확인하여 적용한다. https://vuetifyjs.com/en/styles/text-and-typography</template>
    <template #text>
      <UBox>
        <UItem> </UItem>
      </UBox>

      <!-- <UMarkdownViewer>{{ base2 }}</UMarkdownViewer> -->
    </template>
  </v-card>
</template>

<script setup lang="ts">
// @ts-ignore
import base2 from './md/base2.md'
</script>
