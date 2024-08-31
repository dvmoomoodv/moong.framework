<template>
  <v-card>
    <template #title> </template>
    <template #subtitle
      >https://vuetifyjs.com/en/components/text-fields/#icons 여러 아이콘
      설정타입 1가지만 우선 설정
    </template>
    <template #text>
      <h3>Icon 타입</h3>
      <br /><br />
      <UTextBox type="icon" @iconClick="logMessage"></UTextBox>
      <UTextBox
        type="icon"
        iconType="refresh"
        @iconClick="logMessage"
      ></UTextBox>
      <UTextBox type="icon" iconType="error"></UTextBox>

      <v-text-field
        prepend-inner-icon="mdi-magnify"
        label="Search"
        v-model="data"
      ></v-text-field>
      <v-text-field
        prepend-inner-icon="mdi-refresh"
        label="Refresh"
        v-model="data"
      ></v-text-field>

      <v-text-field label="Search" v-model="data">
        <template v-slot:prepend-inner>
          <v-icon
            icon="mdi-magnify"
            color="primary"
            @click="logMessage"
          ></v-icon>
        </template>
      </v-text-field>
      <v-text-field label="Refresh" v-model="data">
        <template v-slot:prepend-inner>
          <v-icon
            icon="mdi-refresh"
            color="secondary"
            @click="logMessage"
          ></v-icon>
        </template>
      </v-text-field>

      <v-text-field
        prepend-inner-icon="mdi-refresh"
        label="Refresh"
        v-model="data"
        readonly
      ></v-text-field>
      <v-text-field
        prepend-inner-icon="mdi-refresh"
        label="Refresh"
        v-model="data"
        disabled
      ></v-text-field>

      <!-- <UMarkdownViewer>{{ textBox2 }}</UMarkdownViewer> -->
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { UMarkdownViewer } from "#moong/nuxt/components";

// @ts-ignore
import textBox2 from "./md/textbox2.md";

const logMessage = () => {
  console.log("test message");
};

const data = ref(null);
</script>

<style scoped></style>
