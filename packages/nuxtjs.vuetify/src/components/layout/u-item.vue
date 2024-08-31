<template>
  <div class="u-item" ref="uItem" :class="classes" :style="styles">
    <slot v-if="props.scrollType === 'none'" />
    <div v-else style="position: absolute; left: 0; right: 0; top: 0; bottom: 0" :style="{ overflow: props.scrollType }"><slot /></div>
  </div>
</template>

<script setup lang="ts">
/**
 * TODO
 * raio baseSize
 */
import { computed, defineProps, withDefaults, ref, onMounted } from '#ustra/nuxt'
import { useMediaQueryState } from '#ustra/nuxt/composables'
import { dom } from '#ustra/core/utils/browser'
import './styles/layout.scss'

const props = withDefaults(
  defineProps<{
    /**
     * 비활성화 여부
     */
    disabled?: boolean

    /**
     * 비율
     */
    ratio?: number | string

    /**
     * 기본 사이즈
     */
    baseSize?: number | string

    /**
     * 스크롤 유형
     */
    scrollType?: 'none' | 'hidden' | 'auto'
  }>(),
  {
    disabled: false,
    baseSize: 0,
    scrollType: 'none',
  },
)
/**
 * 컴포넌트 최상위 태그 참조
 */
const uItem = ref<HTMLDivElement>(null)
/**
 * u-box 반응형 설정여부 체크
 */
const isResponsive = ref(false)
onMounted(() => {
  isResponsive.value = uItem.value.parentElement.classList.value.includes('u-box-responsive')
})
const classes = computed(() => {
  if (props.disabled) return 'u-layout-state-disabled'
})
const styles = computed(() => {
  const obj: Record<string, any> = {}

  /**
   * 반응형 설정
   */
  if (isResponsive.value && useMediaQueryState().XS) {
    obj.minWidth = 'var(--u-box-responsive-base-width)'
  }
  /**
   * 비율 설정
   */
  if (props.ratio) {
    obj.flexGrow = props.ratio
    obj.flexShrink = props.ratio
    obj.flexBasis = dom.getCssUnit(props.baseSize)
  } else {
    obj.flexGrow = 0
    obj.flexShrink = 0
    obj.flexBasis = dom.getCssUnit(props.baseSize)
  }

  obj.position = 'relative'
  obj.height = '100%'
  obj.width = '100%'

  // if (!props.baseSize) {

  // }

  return obj
})
</script>

<style lang="scss" scoped>
.u-item {
  // display: flex;
  max-width: none;
  min-width: 0;
}
</style>
