<template>
  <v-row
    :class="classes"
    :align="align"
    :align-content="alignContent"
    :align-content-lg="alignContentLg"
    :align-content-md="alignContentMd"
    :align-content-sm="alignContentSm"
    :align-content-xl="alignContentXl"
    :align-lg="alignLg"
    :align-md="alignMd"
    :align-sm="alignSm"
    :align-xl="alignXl"
    :dense="dense"
    :justify="justify"
    :justify-lg="justifyLg"
    :justify-md="justifyMd"
    :justify-sm="justifySm"
    :justify-xl="justifyXl"
    :no-gutters="noGutters"
    :tag="tag"
    :style="styles"
  >
    <slot />
  </v-row>
</template>

<script setup lang="ts">
import { computed } from '#ustra/nuxt'
import { dom } from '#ustra/core/utils/browser'

import './styles/layout.scss'

// v-row
const props = defineProps({
  style: {
    type: String,
    default: '',
  },
  class: {
    type: String,
    default: '',
  },
  height: {
    type: [Number, String],
    default: 0,
  },
  align: {
    type: String,
    default: undefined,
  },
  alignContent: {
    type: String,
    default: undefined,
  },
  alignContentLg: {
    type: String,
    default: undefined,
  },
  alignContentMd: {
    type: String,
    default: undefined,
  },
  alignContentSm: {
    type: String,
    default: undefined,
  },
  alignContentXl: {
    type: String,
    default: undefined,
  },
  alignLg: {
    type: String,
    default: undefined,
  },
  alignMd: {
    type: String,
    default: undefined,
  },
  alignSm: {
    type: String,
    default: undefined,
  },
  alignXl: {
    type: String,
    default: undefined,
  },
  dense: {
    type: Boolean,
    default: false,
  },
  justify: {
    type: String,
    default: undefined,
  },
  justifyLg: {
    type: String,
    default: undefined,
  },
  justifyMd: {
    type: String,
    default: undefined,
  },
  justifySm: {
    type: String,
    default: undefined,
  },
  justifyXl: {
    type: String,
    default: undefined,
  },
  noGutters: {
    type: Boolean,
    default: true,
  },
  tag: {
    type: String,
    default: 'div',
  },
  fix: {
    type: Boolean,
    default: false,
  },
  fill: {
    type: Boolean,
    default: true,
  },
  wrap: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const classes = computed(() => {
  if (props.disabled) return 'u-layout-state-disabled'
})

const styles = computed(() => {
  const styleObj: Record<string, any> = {}

  if (props.height !== 0) {
    styleObj.height = dom.getCssUnit(props.height)
    styleObj.minHeight = dom.getCssUnit(props.height)
  }

  if (!props.fill) {
    styleObj.flexGrow = '0'
  }

  styleObj.flexWrap = props.wrap ? 'wrap' : 'nowrap'
  return styleObj
})

// let heightStyle = ''

// if (props.height !== 0) {
//   heightStyle = ' height : ' + props.height + 'px; min-height: ' + props.height + 'px;'
// }

//#region set size
// let flexSizeStyle = ''
// if (!props.fill) {
//   flexSizeStyle = ' flex-grow: 0; '
// }
// if (props.fix) {
//   flexSizeStyle = ' flex-grow: 0; '
// }
//#endregion
// const uBoxStyle = props.style + heightStyle + flexSizeStyle
// const uBoxClass = 'u-box ' + props.class
</script>

<style>
.u-layout .v-row > .u-item {
  flex-grow: 1;
}
</style>
