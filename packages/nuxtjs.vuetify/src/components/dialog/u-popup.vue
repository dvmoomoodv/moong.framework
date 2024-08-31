<template>
  <VDialog v-bind="attrs" v-model="value" :width="popupWidth" :fullscreen="fullscreen" class="u-popup" :z-index="1400">
    <VCard :height="popupHeight">
      <VCardTitle>
        {{ title }}
        <span class="closeBtn" @click="value = false" v-if="props.showCloseButton">
          <i class="blind">닫기</i>
        </span>
      </VCardTitle>
      <VCardText>
        <slot />
      </VCardText>
      <VCardActions v-if="!!slots.buttons" :style="buttonBoxStyles">
        <div class="btn_wrap">
          <slot name="buttons"></slot>
        </div>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
<script lang="ts" setup>
import { VDialog, VCard, VCardTitle, VCardText, VCardActions } from 'vuetify/components'
import { defineProps, withDefaults, useSlots, defineEmits, watch, computed, useAttrs } from '#ustra/nuxt'
import { useMediaQueryState } from '#ustra/nuxt/composables'
import { useVModel } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    /**
     * 오픈 여부
     */
    modelValue: boolean

    /**
     * 제목
     */
    title?: string

    /**
     * 닫기 버튼 표시 여부
     */
    showCloseButton?: boolean

    /**
     * 넓이
     */
    width?: string | number

    /**
     * 높이
     */
    height?: string | number

    /**
     * 버튼 위치
     */
    buttonAlign?: string

    /**
     * 반응형 여부
     */
    responsive?: boolean
  }>(),
  {
    modelValue: false,
    title: null,
    showCloseButton: true,
    responsive: () => {
      return $ustra.components.getComponentsOption('responsive').enabled
    },
  },
)

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'shown'): void
  (e: 'hidden'): void
}>()

const slots = useSlots()

const value = useVModel(props, 'modelValue')

/**
 * 팝업 Height
 */
const popupHeight = computed(() => {
  if (props.responsive && useMediaQueryState().XS) {
    return '100vh'
  } else {
    return props.height
  }
})

/**
 * 팝업 넓이
 */
const popupWidth = computed(() => {
  if (props.responsive && useMediaQueryState().XS) {
    return '100vh'
  } else {
    return props.width
  }
})

const fullscreen = computed(() => {
  return props.responsive && useMediaQueryState().XS
})

const buttonBoxStyles = computed(() => {
  const obj: Record<string, any> = {}

  if (props.buttonAlign === 'left') {
    obj.justifyContent = 'flex-start'
  } else if (props.buttonAlign === 'center') {
    obj.justifyContent = 'center'
  } else if (props.buttonAlign === 'right') {
    obj.justifyContent = 'flex-end'
  }
  return obj
})

watch(
  () => props.modelValue,
  (v, o) => {
    if (o === undefined && v === false) {
      return
    }
    v ? emits('shown') : emits('hidden')
  },
  {
    flush: 'post',
    immediate: true,
  },
)

const attrs = computed(() => {
  const $attrs = { ...useAttrs() }

  $attrs.persistent = $ustra.utils.core.defaults($attrs.persistent, true)
  $attrs.retainFocus = $ustra.utils.core.defaults($attrs.retainFocus, false)
  $attrs.closeOnContentClick = $ustra.utils.core.defaults($attrs.closeOnContentClick, false)
  $attrs.noClickAnimation = $ustra.utils.core.defaults($attrs.noClickAnimation, true)
  $attrs.transition = $ustra.utils.core.defaults($attrs.transition, 'dialog-bottom-transition')

  return {
    ...$attrs,
    width: props.width,
  }
})
</script>
<script lang="ts">
export default {
  name: 'UPopup',
  inheritAttrs: false,
}
</script>
<style scoped>
.u-popup .btn_wrap {
  width: 100%;
}
</style>
