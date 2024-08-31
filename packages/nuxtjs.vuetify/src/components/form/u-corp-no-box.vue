<template>
  <VTextField
    ref="textControl"
    v-bind="attrs"
    v-model="modelValue"
    maxlength="14"
    @keydown="e => $ustra.utils.event.onlyNumberOnKeydown(e)"
    @input="
      e => {
        if (e.inputType === 'insertText' || e.inputType === 'insertFromPaste') {
          formatValue(e)
        }
      }
    "
    @blur="formatValue"
    @focus="formatValue"
    :validation="{
      els: () => textControl.$el.querySelector('input'),
      rules: [checkValidation],
    }"
  />
</template>
<script lang="ts" setup>
import { VTextField } from 'vuetify/components'
import { computed, useAttrs, defineProps, nextTick, shallowRef } from '#ustra/nuxt'
import { validation } from '#ustra/core/utils'
import { useVModel } from '@vueuse/core'

const textControl = shallowRef<InstanceType<typeof VTextField>>()

const props = defineProps<{
  modelValue: string | null
  required?: boolean
}>()
const modelValue = useVModel(props, 'modelValue')

const attrs = computed(() => {
  const $attrs = useAttrs()
  return $attrs
})

function checkValidation() {
  if (attrs.value.disabled) {
    return true
  }

  let value = (modelValue.value as string) || ''
  // value = value.replace(/[-, _]/g, '')

  if (props.required) {
    if (!value) {
      return '필수 입력입니다.'
    }
  }

  if (!!value && !validation.corpRegisterNum(value, true)) {
    return '유효하지 않은 법인 번호입니다.'
  }

  return true
}

function formatValue(e) {
  nextTick(() => {
    let value = e.target.value.replace(/[^0-9]/g, '').replace(/-/g, '')

    if (value.length >= 6) {
      value = value.substring(0, 6) + '-' + value.substring(6)
    }

    modelValue.value = value
  })
}
</script>
<script lang="ts">
export default {
  name: 'UCorpNoBox',
  inheritAttrs: false,
}
</script>
