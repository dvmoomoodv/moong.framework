<template>
  <v-card>
    <template #title> 버튼 - 아이콘버튼 </template>
    <!-- <template #subtitle> icon 속성 활용 </template> -->
    <template #subtitle
      >https://vuetifyjs.com/en/components/buttons/#buttons
      <br />
      icon button : https://vuetifyjs.com/en/components/buttons/#icon
      <br />
      icon with button : https://vuetifyjs.com/en/components/buttons/#icon-color
    </template>
    <template #text>
      <UBox>
        <UItem> </UItem>
      </UBox>

      <!-- <UMarkdownViewer>{{ base4 }}</UMarkdownViewer> -->
    </template>
  </v-card>
</template>

<script setup lang="ts">
import base4 from './md/base4.md'
</script>
