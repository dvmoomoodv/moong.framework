<template>
  <v-card>
    <template #text>
      <h3>사용자 입력 Box</h3>
      <br />
      UUserInputBox 컴포넌트를 사용하여 사용자를 입력하거나 팝업에서 선택할 수
      있는 입력 Box를 사용할 수 있다.
      <br /><br />
      <UVUserInputBox v-model="user" v-model:objectValue="objectValue" />

      <br />
      <v-chip class="ma-2" color="pink" label text-color="white">
        <v-icon start icon="mdi-label"></v-icon>
        user : {{ user }}
      </v-chip>

      <v-chip class="ma-2" color="pink" label text-color="white">
        <v-icon start icon="mdi-label"></v-icon>
        objectValue : {{ objectValue }}
      </v-chip>

      <br />
      <VBtn @click="() => (user = 'admin')">{{ (user = "admin") }}</VBtn>
      <VBtn @click="() => (user = { code: 'admin', name: '관리자' })">{{
        (user = { code: "admin", name: "관리자" })
      }}</VBtn>
      <VBtn @click="() => (user = null)">{{ (user = null) }}</VBtn>

      <!-- <UMarkdownViewer :content="userPopup3"></UMarkdownViewer> -->
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from "#moong/nuxt";
import { UMarkdownViewer } from "#moong/nuxt/components";
import UVUserInputBox from "#moong/nuxt-vuetify/management/components/input/u-v-user-input-box.vue";

// @ts-ignore
import userPopup3 from "./md/user-popup3.md";

const user = ref(null);
const objectValue = ref(null);
</script>
