<template>
  <VTextField
    ref="textBox"
    v-model="textBoxValue"
    type="icon"
    :readonly="!!selectedCode"
    @keydown.enter.stop="() => {}"
    @input.stop="() => {}"
    @keyup.enter.stop="
      e => {
        showPopup = true
        nextTick(() => codePopup.inputAndSearch(textBoxValue))
        e.stopPropagation()
      }
    "
  >
    <UTextBoxButtonBox>
      <UTextBoxButton
        icon="mdi-close-circle"
        mdiIconColor="#000000"
        @click="
          () => {
            textBox.control.focus()
            selectedCode = null
          }
        "
        v-if="!!selectedCode"
      />
      <UTextBoxButton
        icon="mdi-magnify"
        mdiIconColor="#000000"
        @click.stop="
          e => {
            showPopup = true
            nextTick(() => codePopup.inputAndSearch(null))
          }
        "
      />
    </UTextBoxButtonBox>
    <UVCodePopup
      ref="codePopup"
      v-model="showPopup"
      :grpCd="props.grpCd"
      title="코드 조회"
      @selected="
        code => {
          selectedCode = code
        }
      "
    ></UVCodePopup>
  </VTextField>
</template>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, withDefaults, watch, nextTick, defineOptions } from '#ustra/nuxt'
import { useUstraCodeList } from '#ustra/nuxt/management'
import { baseModels } from '#ustra/core/data'
import { useVModel } from '@vueuse/core'
import UVCodePopup from '../popup/u-v-code-popup.vue'

defineOptions({
  name: 'UCodeInputBox',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    /**
     * 그룹 코드
     */
    grpCd: string
    modelValue: string | null
    objectValue?: baseModels.CodeNameModel | null
  }>(),
  {},
)

const emits = defineEmits<{
  (e: 'update:modelValue', v: string | null): void
  (e: 'update:objectValue', v: baseModels.CodeNameModel | null): void
}>()

// model
const model = useVModel(props, 'modelValue')
const objectModel = useVModel(props, 'objectValue')

// 내부 선택 코드 값
const selectedCode = ref<baseModels.CodeNameModel>(null)

// text box
const textBox = ref<InstanceType<typeof UTextBox>>()
const textBoxValue = ref<string>('')

// 팝업 관련
const showPopup = ref(false)
const codePopup = ref<InstanceType<typeof UCodePopup>>()

// 내부 코드 값 변경 시 처리
watch(selectedCode, v => {
  textBoxValue.value = !v ? '' : v.name
  model.value = !v ? null : v.code
  objectModel.value = v

  emits('update:modelValue', !v ? null : v.code)
  emits('update:objectValue', v)
})

// model 변경 시 처리
watch(
  model,
  (v, ov) => {
    if (!v) {
      selectedCode.value = null
    } else {
      if (selectedCode.value && selectedCode.value.code === v) {
        return
      }

      const codeInfo = useUstraCodeList(props.grpCd).find(code => code.dtlCd === v)

      if (!codeInfo) {
        selectedCode.value = null
        return
      }

      selectedCode.value = { code: codeInfo.dtlCd, name: codeInfo.cdNm }
    }
  },
  {
    immediate: true,
  },
)
</script>
<script lang="ts">
export default {
  name: 'UVCodeInputBox',
}
</script>
