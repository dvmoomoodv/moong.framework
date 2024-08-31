<template>
  <VCard>
    <template #text>
      UFileDropBox 컴포넌트는 Drop된 파일 목록을 조회할 수 있는 기능을 제공한다.
      <UFileDropBox v-model="files" class="mt-2" />

      <v-chip class="mt-2" color="pink" label text-color="white">
        <v-icon start icon="mdi-label"></v-icon>
        selectedFiles : {{ files.map((f) => f.name) }}
      </v-chip>

      <!-- <UMarkdownViewer :content="dropbox1" /> -->
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { ref } from "#moong/nuxt";

// @ts-ignore
import dropbox1 from "./md/dropbox1.md";

const files = ref<File[]>([]);
</script>
