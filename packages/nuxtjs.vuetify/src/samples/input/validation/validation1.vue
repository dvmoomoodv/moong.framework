<template>
  <v-card>
    <template #title> Form Validation </template>
    <template #subtitle>
      UValidationGroup 컴포넌트를 사용하여 Form의 유효성을 확인할 수 있다.
      <br />
    </template>
    <template #text>
      <UValidationGroup ref="validationGroup">
        <div></div>
        <div class="mb-3">
          <div class="mt-2">
            필수 입력 :
            <VTextField />
            <VTextField ref="field1" required v-model="fieldValue1" />
          </div>
          <div class="mt-2">
            필수 입력 :
            <UCodeComboBox
              grpCd="SYS_CD"
              v-model="fieldValue2"
              displayNullText="전체"
            />
          </div>
          <div class="mt-2">
            필수 입력 :
            <VSelect
              v-model="fieldValue3"
              :items="comboItems"
              item-value="value"
              item-title="text"
            />
          </div>
          <div class="mt-2">
            필수 입력 :
            <!-- <URadioGroupBox v-model="fieldValue4" :itemsSource="radioItems" :validation="{ rules: ['required'] }" /> -->
          </div>
          <div class="mt-2">
            필수 입력 :
            <UTextBox type="textarea" :required="true" />
            <VTextArea v-model="fieldValue5" />
          </div>
        </div>
        <VBtn @click="validateForm">Validate</VBtn>
        <VBtn @click="() => validationGroup.init()">Init</VBtn>
      </UValidationGroup>

      <!-- <UMarkdownViewer :content="validation1"></UMarkdownViewer> -->
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref, reactive } from "#moong/nuxt";
import { UMarkdownViewer } from "#moong/nuxt/components";

// @ts-ignore
import validation1 from "./md/validation1.md";

const fieldValue1 = ref(null);
const fieldValue2 = ref(null);
const fieldValue3 = ref(null);
const fieldValue4 = ref(null);
const fieldValue5 = ref(null);

const comboItems = reactive([
  { value: null, text: "선택하세요." },
  { value: "1", text: "Item1" },
  { value: "2", text: "Item2" },
]);

const radioItems = reactive([
  { value: "1", text: "radio1" },
  { value: "2", text: "radio2", disabled: true },
  { value: "3", text: "radio3" },
]);

const validationGroup = ref<InstanceType<typeof UValidationGroup>>();
async function validateForm() {
  const result = await validationGroup.value.validate();

  console.log("result", result);
}
</script>
