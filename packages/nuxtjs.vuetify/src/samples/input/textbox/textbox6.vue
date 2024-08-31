<template>
  <v-card>
    <template #text>
      <h3>MDI 아이콘 활용 (비활성화)</h3>

      iconType에 mdi 아이콘 이름 작성 <NuxtLink to="https://materialdesignicons.com/" target="_blank"> Material Design Icons</NuxtLink> <br /><br />

      color 활용시에는 slot 활용하여 color props로 수정한다. textbox2에 수정.

      <UTextBox type="icon" iconType="mdi-close" />
      <UTextBox type="icon" iconType="mdi-check" />
      <UTextBox type="icon" iconType="mdi-close" mdiIconColor="#ff0000" />
      <UTextBox type="icon" iconType="mdi-check" mdiIconColor="#0000ff" />
      <!-- <UMarkdownViewer>{{ textBox6 }}</UMarkdownViewer> -->
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { UMarkdownViewer } from '#ustra/nuxt/components'

// @ts-ignore
import textBox6 from './md/textbox6.md'
</script>

<style scoped></style>
