<template>
  <v-card title="법인번호 입력">
    <template #text>
      <br /><br />

      <!-- <UCorpNoBox v-model="value" /> -->
      <br />
      <v-chip class="ma-2" color="pink" label text-color="white">
        <v-icon start icon="mdi-label"></v-icon>
        value : {{ value }}
      </v-chip>

      <!-- <UMarkdownViewer :content="doc1" /> -->
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from "#moong/nuxt";

// @ts-ignore
import doc1 from "./md/biz-no3.md";

const value = ref(null);
</script>
