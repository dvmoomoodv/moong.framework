<template>
  <uVRadioGroupBox v-model="comboValue" :itemsSource="radioItemsSource" />
</template>
<script lang="ts" setup>
import { defineProps, withDefaults, computed, defineOptions } from '#ustra/nuxt'
import uVRadioGroupBox from '../../../components/radio/u-v-radio-group-box.vue'

import { useComboVuetifyComponent } from '../../../composables/code-combo'
import type { CodeComboBoxProps, CodeItem } from '../../../composables/code-combo'

const props = withDefaults(defineProps<UCodeRadioGroupBoxProps>(), {
  disabledCodes: () => [],
  onlyUse: true,
  modelValue: null,
  objectValue: null,
  displayCode: false,
  customizeItems: null,
  sortByName: false,
  sortByCode: false,
  displayNullText: null,
})

const { comboValue, itemsSource } = useComboVuetifyComponent(props)
const radioItemsSource = computed(() => {
  return itemsSource.value.map(item => {
    return {
      value: item.value,
      text: item.display,
      disabled: (props.disabledCodes || []).some(c => c === item.value),
    }
  })
})
</script>

<script lang="ts">
export interface UCodeRadioGroupBoxProps extends CodeComboBoxProps {
  /**
   * model value
   */
  modelValue?: string

  /**
   * 비활성화 할 코드 목록
   */
  disabledCodes?: string[]
}

export default {
  name: 'UVCodeRadioGroupBox',
  inheritAttrs: true,
}
</script>
