<template #button>
  <div class="u-button-box" :class="classes">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, useSlots } from '#ustra/nuxt'
const props = defineProps({
  top: {
    type: Boolean,
    default: true,
  },
  right: {
    type: Boolean,
    default: true,
  },
  left: {
    type: Boolean,
    default: false,
  },
  bottom: {
    type: Boolean,
    default: false,
  },
  center: {
    type: Boolean,
    default: false,
  },
})

const classes = computed(() => {
  let tb
  let lr
  if (props.top) {
    tb = ' top '
  }
  if (props.bottom) {
    tb = ' bottom '
  }
  if (props.right) {
    lr = ' right '
  }
  if (props.left) {
    lr = ' left '
  }
  if (props.center) {
    lr = ' center '
  }

  return tb + lr
})
</script>
<style scoped lang="scss">
.u-button-box {
  &.top {
    margin-bottom: auto;
  }
  &.right {
    margin-left: auto;
  }

  &.bottom {
    margin-top: auto;
  }
  &.left {
    margin-right: auto;
  }
  &.center {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
