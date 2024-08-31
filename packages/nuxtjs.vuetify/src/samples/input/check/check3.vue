<template>
  <v-card>
    <template #title></template>
    <template #subtitle> Vuetify utility class 사용</template>
    <template #text>
      <h3>direction</h3>
      direction 속성을 사용하여 하위 아이템의 방향 변경할 수 있다. <br />
      - row : 아이템을 줄 기준으로 (기본 값) <br />
      - column : 아이템을 줄이 쌓이는 형태로 <br /><br />

      <UCheckGroupBox
        :items-source="[
          { trueValue: 'Y', falseValue: 'N', text: 'Item1' },
          { trueValue: 'Y', falseValue: 'N', text: 'Item2' },
          { trueValue: 'Y', falseValue: 'N', text: 'Item3' },
          { trueValue: 'Y', falseValue: 'N', text: 'Item4', disabled: true },
        ]"
        :border="true"
        v-model="checked3"
        direction="row"
      >
      </UCheckGroupBox>

      <div class="d-inline-flex">
        <v-checkbox label="Checkbox"></v-checkbox>
        <v-checkbox label="Checkbox"></v-checkbox>
      </div>

      <!-- <UMarkdownViewer :content="doc" /> -->
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref, reactive } from "#moong/nuxt";
import { UMarkdownViewer } from "#moong/nuxt/components";

// @ts-ignore
import doc from "./md/check3.md";

const checked3 = reactive(["N", "N", "N", "N"]);
</script>
