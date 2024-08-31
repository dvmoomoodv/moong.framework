<template>
  <div>
    <VCard title="반응형 레이아웃 설정"></VCard>
    <ResponsiveSetting1 />
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: 'samples',
})
import ResponsiveSetting1 from './responsive-setting/responsive-setting1.vue'
</script>
