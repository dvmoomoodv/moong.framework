<template>
  <Datepicker v-bind="attrs" :state="state" :class="classes" @open="onDatePickerOpen" @closed="onDatePickerClose">
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
    <template #month="{ text, value }" v-if="props.showMonthLabel === false"> {{ value + 1 }} </template>
  </Datepicker>
  <VOverlay v-model="isDatePickerOpen" scroll-strategy="none"></VOverlay>
</template>
<script lang="ts" setup>
import { computed, useAttrs, defineExpose, ref, defineProps, withDefaults } from '#ustra/nuxt'
import Datepicker from '@vuepic/vue-datepicker'
import { core } from '#ustra/core/utils'
import { ko } from 'date-fns/locale'

const props = withDefaults(
  defineProps<{
    /**
     * 월 라벨 사용여부
     */
    showMonthLabel?: boolean
    /**
     * Backdrop 적용 유무
     */
    showBackdrop?: boolean
    /**
     * Backdrop시 ScrollLock 유무
     */
    // scrollLock?: boolean
  }>(),
  {
    showMonthLabel: () => {
      return $ustra.components.getComponentsOption('UDatepicker').showMonthLabel
    },
    showBackdrop: false,
    // scrollLock: true,
  },
)

/**
 * Backdrop 옵션 추가
 * 수정자 이무현
 */
const isDatePickerOpen = ref(false)
const classes = computed(() => {
  let returnClasses = ''
  /**
   * Backdrop 활용시에 class 지정
   */
  if (props.showBackdrop) {
    if (isDatePickerOpen.value) {
      returnClasses += 'datepicker-open'
    } else {
      returnClasses += ''
    }
  }
  return returnClasses
})

const onDatePickerOpen = () => {
  if (props.showBackdrop) {
    isDatePickerOpen.value = true
    // if (props.scrollLock) {
    //   document.body.style.overflow = 'hidden'
    // }
  }
}
const onDatePickerClose = () => {
  if (props.showBackdrop) {
    isDatePickerOpen.value = false
    // if (props.scrollLock) {
    //   document.body.style.overflow = 'auto'
    // }
  }
}

const state = ref(null)
/**
 * vue datepicker 기본 옵션 추가
 * weekStart
 *   - 일요일 시작, 월요일 시작 사이트에 맞춰 적용이 가능하도록 nuxt.config.ts에서 수정가능하도록 변경
 *   - default : 1 (월요일)
 * 수정자 : 이무현
 */
const attrs = computed(() => {
  const $attrs = useAttrs()
  return core.deepMerge(
    {
      autoApply: true,
      teleport: true,
      enableTimePicker: false,
      locale: 'ko-KR',
      formatLocale: ko,
      format: 'yyyy-MM-dd',
      weekStart: $ustra.components.getComponentsOption('UDatepicker').weekStart,
    },
    $attrs,
  )
})

defineExpose({
  validate: () => {
    let message = null
    if (attrs.value.required && !attrs.value.disabled) {
      if (!attrs.value.modelValue) {
        message = '필수 입력입니다.'
      }
    }

    return {
      isValid: !message,
      message,
      onValidated(result) {
        if (attrs.value.disabled) {
          state.value = null
          return
        }
        state.value = result
      },
      onInit() {
        state.value = null
      },
    }
  },
})
</script>
<script lang="ts">
export default {
  name: 'UDatepicker',
  inheritAttrs: false,
}
</script>
<style>
/* .datepicker-open {
  position: relative;
}

.datepicker-open::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.5);
} */
</style>
