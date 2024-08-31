<template>
  <v-card>
    <template #text>
      <h3>상태 값 제한</h3>

      <UMarkdownViewer :content="doc1"></UMarkdownViewer>
      <br />
      <UVUserInputBox v-model="user" usrSttCd="01" />
      <UMarkdownViewer :content="doc2"></UMarkdownViewer>
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from '#ustra/nuxt'
import { UMarkdownViewer } from '#ustra/nuxt/components'
import UVUserInputBox from '#ustra/nuxt-vuetify/management/components/input/u-v-user-input-box.vue'

// @ts-ignore
import doc1 from './md/user-popup4-1.md'

// @ts-ignore
import doc2 from './md/user-popup4-2.md'

const user = ref(null)
</script>
