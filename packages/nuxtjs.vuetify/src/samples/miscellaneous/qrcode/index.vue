<template>
  <div><VueQrcode value="123456" /></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import VueQrcode from 'vue-qrcode'

definePageMeta({
  layout: 'samples',
})
</script>

<style></style>
