<template>
  <USampleContentContainer>
    <!-- <UMarkdownViewer :content="doc1" /> -->

    <!-- <WjAutoComplete v-bind="options" v-model="value" displayMemberPath="country" selectedValuePath="id" :itemsSource="itemsSource" /> -->
    <br /><br />

    <!-- <UCheckGroupBox v-model="options.caseSensitiveSearch" :itemsSource="[{ text: 'caseSensitiveSearch' }]" />
    <UCheckGroupBox v-model="options.beginsWithSearch" :itemsSource="[{ text: 'beginsWithSearch' }]" />
    <UCheckGroupBox v-model="options.isAnimated" :itemsSource="[{ text: 'isAnimated' }]" /> -->
    <br />
    <span
      >delay:
      <VTextField v-model="options.delay" style="width: 100px" />
    </span>
    <span class="ml-3">
      maxItems:
      <VTextField v-model="options.maxItems" style="width: 100px" />
    </span>

    <br /><br />

    <v-chip class="ma-2" color="pink" label text-color="white">
      <v-icon start icon="mdi-label"></v-icon>
      selectedValue : {{ value }}
    </v-chip>

    <!-- <UMarkdownViewer :content="doc2" /> -->
  </USampleContentContainer>
</template>
<script lang="ts" setup>
import { ref, reactive } from "#moong/nuxt";
import { USampleContentContainer } from "#moong/nuxt-vuetify/samples";
import data from "./data";

// @ts-ignore
import doc1 from "./md/auto-complete1-1.md";

// @ts-ignore
import doc2 from "./md/auto-complete1-2.md";

const value = ref(null);
const itemsSource = reactive(data);
const options = reactive({
  caseSensitiveSearch: false,
  beginsWithSearch: false,
  isAnimated: false,
  delay: 500,
  maxItems: 6,
});
</script>
