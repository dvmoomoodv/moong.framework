<template>
  <VCard>
    <template #text>
      <h3>showBackdrop</h3>
      <br />
      showBackdrop : Date 대화상자 오픈 시 overlay를 표시한다.<br />

      <br /><br />

      <UDatepicker v-model="value" showBackdrop />
      <v-chip class="ma-2" color="pink" label text-color="white">
        <v-icon start icon="mdi-label"></v-icon>
        value : {{ value }}
      </v-chip>

      <!-- <UMarkdownViewer :content="doc1" /> -->
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from "#moong/nuxt";
import { UMarkdownViewer } from "#moong/nuxt/components";
import UDatepicker from "#moong/nuxt-vuetify/components/datepicker/u-datepicker.vue";

// @ts-ignore
import doc1 from "./md/datepicker8.md";

const value = ref(null);
</script>
