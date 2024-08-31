<template>
  <UVCheckGroupBox v-model="comboValue" :itemsSource="checkItemsSource" :stack="true" />
  <span>test</span>
</template>
<script lang="ts" setup>
import { defineProps, withDefaults, computed, reactive, defineOptions } from '#ustra/nuxt'
import { useVModel } from '@vueuse/core'
import { useComboComponent } from '#ustra/nuxt-vuetify/composables/code-combo'
import type { CodeComboBoxProps } from '#ustra/nuxt-vuetify/composables/code-combo'
import isEqual from 'lodash/isEqual'
import UVCheckGroupBox from '../../check-box/u-v-check-group-box.vue'

defineOptions({
  inheritAttrs: true,
})

const props = withDefaults(defineProps<UCodeCheckGroupBoxProps>(), {
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

const { itemsSource, objectValue } = useComboComponent(props)
const checkItemsSource = computed(() => {
  return itemsSource.value.map(item => {
    return {
      value: item.value,
      text: item.display,
      disabled: (props.disabledCodes || []).some(c => c === item.value),
      allSelectedItem: item.value == null && !!props.displayNullText,
    }
  })
})

const vmodelValue = useVModel(props, 'modelValue')
const comboValue = computed({
  get() {
    if (!vmodelValue.value) {
      return reactive(checkItemsSource.value.map(() => false))
    } else {
      const v = checkItemsSource.value.map(i => {
        return vmodelValue.value.some(v => v === i.value)
      })

      if (props.displayNullText) {
        v[0] = !v.some((i, index) => {
          return index > 0 && !i
        })
      }

      return reactive(v)
    }
  },
  set(v: boolean[]) {
    if (!v) {
      vmodelValue.value = []
      objectValue.value = []
    } else {
      const values = checkItemsSource.value
        .filter((item, index) => v[index])
        .filter(item => {
          if (props.displayNullText && item.value == null) {
            return false
          }
          return true
        })

      const value = values.map((item, index) => item.value)
      if (isEqual(value, vmodelValue.value)) {
        return
      }

      vmodelValue.value = value
      objectValue.value = values.map((item, index) => item.value).map(code => itemsSource.value.find(s => s.dtlCd === code))
    }
  },
})

if (!vmodelValue.value) {
  vmodelValue.value = []
  objectValue.value = []
}
</script>

<script lang="ts">
export interface UCodeCheckGroupBoxProps extends CodeComboBoxProps {
  /**
   * model value
   */
  modelValue?: string[]

  /**
   * 비활성화 할 코드 목록
   */
  disabledCodes?: string[]
}
</script>
<script lang="ts">
export default {
  name: 'UVCodeCheckGroupBox',
}
</script>
