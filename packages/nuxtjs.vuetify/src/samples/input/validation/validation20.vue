<template>
  <v-card>
    <template #title> Vuetify </template>
    <template #text>
      <!-- <UMarkdownViewer :content="doc1"></UMarkdownViewer> -->

      <UValidationGroup ref="validationGroup">
        <VTextField :validation="{ rules: ['required'] }" />
        <VTextField :validation="{ rules: ['required'] }" />
      </UValidationGroup>

      <VBtn @click="() => validationGroup.validate()">Validate</VBtn>

      <!-- <UMarkdownViewer :content="doc2"></UMarkdownViewer> -->
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref, defineComponent } from "#moong/nuxt";
import { UMarkdownViewer } from "#moong/nuxt/components";
import { UValidationGroup } from "#moong/nuxt-vuetify/components";

// @ts-ignore
import doc1 from "./md/validation20-1.md";
// @ts-ignore
import doc2 from "./md/validation20-2.md";

const validationGroup = ref<InstanceType<typeof UValidationGroup>>();
</script>
