<template>
  <v-combobox
    :auto-select-first="true"
    :items="itemsSource"
    v-model="comboValue"
    :item-title="props.itemTitle"
    :item-value="props.itemValue"
    :return-object="false"
    @update:modelValue="valueSelect"
  >
  </v-combobox>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults, watch, defineOptions } from '#ustra/nuxt'

const selectedGrpCode = ref<string>(null)

defineOptions({
  inheritAttrs: false,
})

interface CodeComboBoxProps {
  /**
   * 그룹 코드
   */
  grpCd: string

  /**
   * 사용 중인 코드 값만 조회 여부
   */
  onlyUse?: boolean

  /**
   * 코드 디스플레이 여부
   */
  displayCode?: boolean

  /**
   * 목록 커스토마이징 function
   */
  customizeItems?: (codes: CodeItem[]) => CodeItem[]

  /**
   * 이름 순 정렬 여부
   */
  sortByName?: boolean

  /**
   * 코드 순 정렬 여부
   */
  sortByCode?: boolean

  /**
   * null value text
   */
  displayNullText?: string

  /**
   * object value
   */
  objectValue?: CodeItem

  /**
   * combobox Label
   */
  itemTitle?: string

  /**
   * combobox value
   */
  itemValue?: string
}

/* @vue-ignore */
interface UCodeComboBoxProps extends CodeComboBoxProps {
  /**
   * model value
   */
  modelValue?: string
}

/* @vue-ignore */
const props = withDefaults(defineProps<UCodeComboBoxProps>(), {
  onlyUse: true,
  modelValue: null,
  objectValue: null,
  displayCode: false,
  customizeItems: null,
  sortByName: false,
  sortByCode: false,
  displayNullText: null,
  itemTitle: 'display',
  itemValue: 'value',
})

const { comboValue, itemsSource, vmodelValue, objectValue } = useComboComponent(props)

const isAutoSelectFirst = ref(true)
onMounted(() => {
  isAutoSelectFirst.value = true
})

const itemProps = v => {
  return {
    display: v.display,
    value: v.value,
  }
}

const valueSelect = v => {
  comboValue.value = v
}
</script>
<script lang="ts">
export default {
  name: 'UVCodeComboBox',
}
</script>
