<template>
  <v-card>
    <template #text>
      <h3>itemAlign (검토)</h3>
      itemAlign 속성은 하위 아이템의 정렬 기준을 변경할 수 있다. left / center /
      right 값을 설정할 수 있으며, 기본 값은 center 이다.<br />
      direction 속성이 "column"일 때만 유효하다.

      <URadioGroupBox
        :items-source="[
          { value: 'left', text: 'left' },
          { value: 'center', text: 'center' },
          { value: 'right', text: 'right' },
        ]"
        v-model="alignValue"
      ></URadioGroupBox>
      <URadioGroupBox
        :items-source="[
          { value: '01', text: 'Item1' },
          { value: '01', text: 'Item2' },
          { value: '03', text: 'Item3' },
          { value: '04', text: 'Item4', disabled: true },
        ]"
        :border="true"
        :itemAlign="alignValue"
        direction="column"
        v-model="radioValue"
      >
      </URadioGroupBox>

      <v-radio-group v-model="data" column>
        <v-radio color="red" label="red" value="red">
          <template #label>test</template>
          <template #value>test1</template>
        </v-radio>
        <v-radio
          color="red-darken-3"
          label="red-darken-3"
          value="red-darken-3"
          disabled
        ></v-radio>
        <v-radio color="indigo" label="indigo" value="indigo"></v-radio>
      </v-radio-group>

      <!-- <UMarkdownViewer :content="doc1" /> -->
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from "#moong/nuxt";
import { UMarkdownViewer } from "#moong/nuxt/components";

// @ts-ignore
import doc1 from "./md/radio4.md";

const radioValue = ref("01");
const alignValue = ref<"left" | "center" | "right">("left");

const data = ref(null);
</script>
