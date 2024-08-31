<template>
  <VCard>
    <template #text>
      <h3>required</h3>
      <br />
      required 속성을 true로 설정하면 선택되거나 업로드된 파일이 없을 경우,
      Validation 오류를 발생한다.<br /><br />

      <UValidationGroup ref="validationGroup">
        <USingleFileUploader
          fileGroupId="ustra-sample"
          v-model:fileId="fileId"
          :required="true"
        />
      </UValidationGroup>

      <br />
      <VBtn @click="() => validationGroup.validate()">Validate</VBtn>

      <!-- <UMarkdownViewer :content="uploader3" /> -->
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { ref } from "#moong/nuxt";

// @ts-ignore
import uploader3 from "./md/uploader4.md";

const validationGroup = ref<InstanceType<typeof UValidationGroup>>();

const fileId = ref(null);

const uploader = ref<InstanceType<typeof USingleFileUploader>>(null);
</script>
