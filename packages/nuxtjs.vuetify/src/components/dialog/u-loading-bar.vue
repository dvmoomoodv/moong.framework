<template>
  <VOverlay :model-value="showLoadingBar" :closeOnContentClick="false" class="align-center justify-center" :persistent="true">
    <VProgressCircular indeterminate size="64" color="warning"></VProgressCircular>
  </VOverlay>
  <VOverlay :model-value="showPrgressBar" :closeOnContentClick="false" class="align-center justify-center" :persistent="true">
    <VProgressCircular :rotate="360" :size="100" :width="15" :model-value="progressRate" color="teal">
      {{ progressRate }}
    </VProgressCircular>
  </VOverlay>
</template>
<script lang="ts" setup>
import { VProgressCircular, VOverlay } from 'vuetify/lib/components/index.mjs'
import { defineUstraLoadingBarComponent } from '#ustra/nuxt/composables/components/loading-bar'

defineOptions({
  name: 'ULoadingBar',
  components: { VOverlay, VProgressCircular },
})

const { showLoadingBar, showPrgressBar, progressRate } = defineUstraLoadingBarComponent()
</script>
