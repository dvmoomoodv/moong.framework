```html
<template>
  <img :src="$ustra.management.file.getViewUrl(fileId, fileNo, fileGroupId)" style="max-height: 200px" />
</template>
<script lang="ts" setup>
const fileGroupId = ref('ustra-sample-image')
const fileId = ref('xYjN4kzM3MjN5ATM1IGZmVlVWdWONlGVRZWTsFTUCNnWmRG')
const fileNo = ref(1)
</script>
```
