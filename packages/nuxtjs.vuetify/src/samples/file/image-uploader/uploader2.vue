<template>
  <VCard>
    <template #text>
      <h3>수정 모드</h3>
      <br />
      수정 모드는 기존에 파일을 업로드 했던 고유 파일 아이디를 설정할 경우 기존
      파일 정보를 조회한 후 수정할 수 있다. <br /><br />
      fileId :
      <VTextField v-model="fileId" style="width: 400px" />

      <!-- <UImageUploader ref="uploader" fileGroupId="ustra-sample-image" :width="500" :height="500" v-model:fileId="fileId" /> -->
      <VBtn class="mt-2" @click="() => uploadFile()">Upload</VBtn>
      <VBtn class="mt-2" @click="() => createFormData()">Form Data</VBtn>

      <!-- <UMarkdownViewer :content="upload2" /> -->
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { ref } from "#moong/nuxt";

// @ts-ignore
import upload2 from "./md/uploader2.md";

const fileId = ref("xYjN4kzM3MjN5ATM1IGZmVlVWdWONlGVRZWTsFTUCNnWmRG");

const uploader = ref<InstanceType<typeof UImageUploader>>(null);
async function uploadFile() {
  const result = await uploader.value.upload();

  $ustra.logger.info("file upload result", result);
  alert("업로드가 완료되었습니다. file id : " + result.fileId);
}

function createFormData() {
  $ustra.logger.info(
    "file upload result",
    Array.from(uploader.value.createFormData().entries())
  );
}
</script>
