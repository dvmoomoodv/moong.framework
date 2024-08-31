<template>
  <div class="u-field-set" :class="classes" :style="styles">
    <div class="u-field-set-title" v-if="label" :style="labelStyles">{{ label }}</div>
    <div class="u-field-set-slot" :style="slotStyles">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults } from '#ustra/nuxt'
import { dom } from '#ustra/core/utils/browser'
import './styles/form.scss'
const props = withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
    backgroundColor?: string
    rowType?: string
    fieldLabelWidthFix?: boolean
    /**
     * 반응형 여부
     */
    responsive?: boolean

    /**
     * 반응형시 기준 너비
     */
    responsiveBaseWidth?: number | string
  }>(),
  {
    label: null,
    disabled: false,
    backgroundColor: null,
    rowType: null,
    fieldLabelWidthFix: false,
    responsive: () => {
      return $ustra.components.getComponentsOption('responsive').enabled
    },
    responsiveBaseWidth: 400,
  },
)

const classes = computed(() => {
  let returnClasses = ''
  if (props.disabled) {
    returnClasses += 'u-form-state-disabled'
  }
  if (props.responsive) {
    returnClasses += 'u-field-set-responsive'
  }
  return returnClasses
})
const styles = computed(() => {
  if (props.responsive) {
    return { '--u-field-set-responsive-base-width': dom.getCssUnit(props.responsiveBaseWidth) }
  }
})
const labelStyles = computed(() => {
  const obj: Record<string, any> = {}
  obj.backgroundColor = props.backgroundColor
  return obj
})
const slotStyles = computed(() => {
  return { '--u-field-set-background-color': props.backgroundColor }
})
</script>

<style scoped lang="scss">
.u-field-set {
  width: 100%;
  margin-bottom: 6px;
}
.u-field-set-title {
  font-weight: bold;
  padding: 2px 5px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  line-height: 2;
}
.u-field-set-slot {
  border-top: 1px solid #151515;
  border-bottom: 1px solid #bcbcbc;
}
</style>
