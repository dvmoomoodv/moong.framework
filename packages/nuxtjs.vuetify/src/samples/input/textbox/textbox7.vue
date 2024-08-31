<template>
  <v-card>
    <template #text>
      <h3>Icon 타입 - 2개활용</h3>
      iconType2, iconClick2 추가 사용 안과 밖 설정 가능 slot 활용
      <br /><br />

      <UTextBox
        type="icon"
        iconType="refresh"
        @iconClick="logMessage"
        iconType2="mdi-check"
        @iconClick2="logMessage"
      ></UTextBox>
      <UTextBox
        type="icon"
        iconType="refresh"
        @iconClick="logMessage"
        iconType2="find"
        @iconClick2="logMessage"
      ></UTextBox>

      <v-text-field label="Search" v-model="data">
        <template v-slot:prepend>
          <v-icon
            icon="mdi-refresh"
            color="primary"
            @click="logMessage"
          ></v-icon>
          <v-icon
            icon="mdi-magnify"
            color="secondary"
            @click="logMessage2"
          ></v-icon>
        </template>
        <template v-slot:prepend-inner>
          <v-icon
            icon="mdi-refresh"
            color="primary"
            @click="logMessage"
          ></v-icon>
          <v-icon
            icon="mdi-magnify"
            color="secondary"
            @click="logMessage2"
          ></v-icon>
        </template>
        <template v-slot:append-inner>
          <v-icon
            icon="mdi-refresh"
            color="primary"
            @click="logMessage"
          ></v-icon>
          <v-icon
            icon="mdi-magnify"
            color="secondary"
            @click="logMessage2"
          ></v-icon>
        </template>
        <template v-slot:append>
          <v-icon
            icon="mdi-refresh"
            color="primary"
            @click="logMessage"
          ></v-icon>
          <v-icon
            icon="mdi-magnify"
            color="secondary"
            @click="logMessage2"
          ></v-icon>
        </template>
      </v-text-field>

      <v-text-field label="Search" v-model="data">
        <template v-slot:append>
          <v-icon
            icon="mdi-refresh"
            color="primary"
            @click="logMessage"
          ></v-icon>
          <v-icon
            icon="mdi-magnify"
            color="secondary"
            @click="logMessage2"
          ></v-icon>
          <v-icon
            icon="mdi-refresh"
            color="primary"
            @click="logMessage"
          ></v-icon>
          <v-icon
            icon="mdi-magnify"
            color="secondary"
            @click="logMessage2"
          ></v-icon>
          <v-icon
            icon="mdi-refresh"
            color="primary"
            @click="logMessage"
          ></v-icon>
          <v-icon
            icon="mdi-magnify"
            color="secondary"
            @click="logMessage2"
          ></v-icon>
          <v-icon
            icon="mdi-refresh"
            color="primary"
            @click="logMessage"
          ></v-icon>
          <v-icon
            icon="mdi-magnify"
            color="secondary"
            @click="logMessage2"
          ></v-icon>
          <v-icon
            icon="mdi-refresh"
            color="primary"
            @click="logMessage"
          ></v-icon>
          <v-icon
            icon="mdi-magnify"
            color="secondary"
            @click="logMessage2"
          ></v-icon>
        </template>
      </v-text-field>

      <!-- <UMarkdownViewer>{{ textBox7 }}</UMarkdownViewer>-->
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { UMarkdownViewer } from "#moong/nuxt/components";

// @ts-ignore
import textBox7 from "./md/textbox7.md";

const data = ref("Test");
const logMessage = () => {
  console.log("test message");
};
const logMessage2 = () => {
  console.log("test message2");
};
</script>

<style scoped></style>
