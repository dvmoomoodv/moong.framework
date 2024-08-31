<template>
  <div class="u-help-box">
    <div class="help-box">
      <v-icon v-if="showIcon" class="mr-1">mdi-information-outline</v-icon>
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  showIcon: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.u-help-box {
  flex-grow: 1;
  font-size: 0.875rem;
  margin: 0 0 0.375rem 0;
  .help-box {
    padding: 0.625rem;
    background-color: #efefef;
    border-left: 5px solid #888;
    flex-grow: 1;
  }
}
</style>
