<template>
  <VCard>
    <template #text>
      <h3>Validation</h3>
      <br />
      UValidationGroup을 이용한 Validation 처리 예제이다.
      <br />
      <UValidationGroup ref="validationGroup" class="mt-2">
        <UDatepicker v-model="value" :required="true" />
      </UValidationGroup>

      <VBtn class="mt-2" @click="() => validationGroup.validate()"
        >Validate</VBtn
      >
      <VBtn class="mt-2" @click="() => validationGroup.init()">Init</VBtn>

      <br /><br />
      <v-chip class="ma-2" color="pink" label text-color="white">
        <v-icon start icon="mdi-label"></v-icon>
        value : {{ value }}
      </v-chip>

      <!-- <UMarkdownViewer :content="doc1" /> -->
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { ref, shallowRef } from "#moong/nuxt";
import { UMarkdownViewer } from "#moong/nuxt/components";
import UDatepicker from "#moong/nuxt-vuetify/components/datepicker/u-datepicker.vue";

// @ts-ignore
import doc1 from "./md/datepicker4.md";

const value = ref(null);
const validationGroup = shallowRef<InstanceType<typeof UValidationGroup>>();
</script>
