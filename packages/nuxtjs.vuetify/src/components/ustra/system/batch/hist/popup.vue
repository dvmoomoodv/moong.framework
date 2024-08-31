<template>
  <UPopup v-model="modelValue" :width="800" :height="1600" title="배치 실행 로그 조회">
    <div v-html="data" />
    <template #buttons>
      <UButton text="닫기" style="primary" @click="close" />
    </template>
  </UPopup>
</template>
<script lang="ts" setup>
import { defineProps, ref, reactive, defineEmits, nextTick, watch } from '#ustra/nuxt'
import { useVModel } from '@vueuse/core'
import { useUstraBatchHistService } from '#ustra/nuxt/management'
import UButton from '#ustra/nuxt-vuetify/components/button/u-button.vue'
import UMessage from '#ustra/nuxt-vuetify/components/message/u-message.vue'

import UVCodeComboBox from '#ustra/nuxt-vuetify/management/components/combo-box/u-v-code-combo-box.vue'
import UVRadioGroupBox from '#ustra/nuxt-vuetify/components/radio/u-v-radio-group-box.vue'
const service = useUstraBatchHistService()

const props = defineProps<{
  modelValue: boolean
  batHistId: string
}>()
const modelValue = useVModel(props, 'modelValue')

watch(
  modelValue,
  v => {
    if (!props.batHistId) return
    loadData(props.batHistId)
  },
  {
    immediate: true,
  },
)

async function close() {
  await batchHistLogging.value.close()
  modelValue.value = false
}

const data = ref(null)
const batchHistLogging = ref(null)
async function loadData(batHistId: string) {
  data.value = ''
  batchHistLogging.value = await service.getLog(batHistId, async log => {
    console.log('log : ', log)
    if (!log) {
      return
    }
    await nextTick()
    if (data.value) {
      data.value += '\n'
    }
    data.value += '<div>' + log + '</div>'
  })
}
</script>
