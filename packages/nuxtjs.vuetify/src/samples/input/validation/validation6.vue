<template>
  <v-card>
    <template #title> disabled </template>
    <template #text>
      disabled 속성을 사용하여 Validation을 비활성한다. 또한 disabled 속성은
      영역 내의 모든 컴포넌트를 비활성화 시킨다. disabled 속성이 true일 경우
      Validation 결과는 항상 true를 반환한다.
      <UValidationGroup ref="validationGroup" :disabled="disabled">
        <div class="mb-3">
          <div class="mt-2">
            필수 입력 :
            <VTextField ref="field1" :isRequired="true" v-model="fieldValue1" />
          </div>
          <div class="mt-2">
            필수 입력 :
            <UCodeComboBox
              grpCd="SYS_CD"
              v-model="fieldValue2"
              displayNullText="전체"
            />
          </div>
        </div>
      </UValidationGroup>
      <VBtn @click="validateForm">Validate</VBtn>
      <VBtn @click="() => validationGroup.init()">Init</VBtn>
      <VBtn @click="() => (disabled = !disabled)">{{
        disabled ? "활성화" : "비활성화"
      }}</VBtn>

      <!-- <UMarkdownViewer :content="doc1"></UMarkdownViewer> -->
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from "#moong/nuxt";
import { UMarkdownViewer } from "#moong/nuxt/components";

// @ts-ignore
import doc1 from "./md/validation6.md";

const fieldValue1 = ref(null);
const fieldValue2 = ref(null);
const disabled = ref(false);

const validationGroup = ref<InstanceType<typeof UValidationGroup>>();
async function validateForm() {
  const result = await validationGroup.value.validate();

  console.log("result", result);
}
</script>
