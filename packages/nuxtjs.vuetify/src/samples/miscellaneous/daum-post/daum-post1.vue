<template>
  <VCard>
    <template #text>
      <!-- <UMarkdownViewer :content="daumPost1_1" /> -->

      <UFieldSet>
        <UFieldRow>
          <UField label="우편번호">
            <v-text-field
              append-inner-icon="mdi-magnify"
              density="compact"
              label="Search templates"
              variant="solo"
              hide-details
              single-line
              v-model="inputData.zipNo"
              @click:append-inner="() => (showPopup = true)"
            ></v-text-field>
            <VTextField v-model="inputData.address1"></VTextField>
            <VTextField v-model="inputData.address2"></VTextField>
          </UField>
        </UFieldRow>
      </UFieldSet>

      <UDaumPostPopup v-model="showPopup" :options="options" @selected="onSelected" />
      <br />
      <!-- <UMarkdownViewer :content="daumPost1_2" /> -->
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { DaumPostResult, DaumPostScreenOptions } from '#ustra/nuxt/externals/daum/post'
import { reactive, ref } from '#ustra/nuxt'
import { UMarkdownViewer } from '#ustra/nuxt/components'
import UDaumPostPopup from '#ustra/nuxt-vuetify/components/daum/u-daum-post-popup.vue'

// @ts-ignore
import daumPost1_1 from './md/daum-post1-1.md'

// @ts-ignore
import daumPost1_2 from './md/daum-post1-2.md'

const options: DaumPostScreenOptions = {
  autoClose: false,
}

const inputData = reactive({
  zipNo: null,
  address1: null,
  address2: null,
})

function onSelected(result: DaumPostResult) {
  inputData.zipNo = result.zonecode
  inputData.address1 = result.addr
}

const showPopup = ref(false)
</script>
