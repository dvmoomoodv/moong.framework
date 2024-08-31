<template>
  <v-card>
    <template #text>
      <h3>Click Event</h3>
      일반적으로 click 이벤트가 발생할 경우, modelValue 값이 업데이트 되기
      전이므로 value 값을 확인하고 싶은 경우, event 객체의 value 값으로 확인할
      수 있다.
      <URadioGroupBox
        v-model="radioValue"
        :itemsSource="radioItems"
        @click:append="onRadioClick"
      />

      <v-radio-group v-model="data" column @click="onRadioGroupClick">
        <v-radio color="red" label="red" value="red"></v-radio>
        <v-radio
          color="red-darken-3"
          label="red-darken-3"
          value="red-darken-3"
          disabled
        ></v-radio>
        <v-radio color="indigo" label="indigo" value="indigo"></v-radio>
        <v-radio
          color="indigo-darken-3"
          label="indigo-darken-3"
          value="indigo-darken-3"
        ></v-radio>
        <v-radio color="orange" label="orange" value="orange"></v-radio>
        <v-radio
          color="orange-darken-3"
          label="orange-darken-3"
          value="orange-darken-3"
        ></v-radio>
      </v-radio-group>
      <v-chip class="ma-2" color="pink" label text-color="white">
        <v-icon start icon="mdi-label"></v-icon>
        radioValue : {{ radioValue }}
      </v-chip>

      <!-- <UMarkdownViewer :content="radio2" /> -->
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref, reactive } from "#moong/nuxt";
import { UMarkdownViewer } from "#moong/nuxt/components";

// @ts-ignore
import radio2 from "./md/radio2.md";

const radioItems = reactive([
  { value: "1", text: "radio1" },
  { value: "2", text: "radio2", disabled: true },
  { value: "3", text: "radio3" },
]);

const data = ref("red");

const radioValue = ref("1");

function onRadioClick(e) {
  alert("radio value : " + e.value);
}

function onRadioGroupClick(e: Event) {
  console.log(data.value);
}
</script>
