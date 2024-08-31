```html
<template>
  <UMultiFileUploader ref="uploader" fileGroupId="menuIcon" v-model:fileId="fileId" :readonly="true" />
</template>
<script lang="ts" setup>
const fileId = ref('xYjN4czNyEzMykTNwImNFRkMyV0QIpkWpFmRL1mQ0wWa4FE')

const uploader = ref<InstanceType<typeof UMultiFileUploader>>(null)
</script>
```
