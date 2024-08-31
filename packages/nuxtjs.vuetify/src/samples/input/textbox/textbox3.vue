<template>
  <v-card>
    <template #text>
      <h3>Mask 타입</h3>
      <br /><br />

      <UTextBox type="mask" v-model="test1" />
      <UTextBox type="mask" mask="lll-lll-lll-lll" v-model="test2" />

      <v-text-field
        hide-details="auto"
        v-model="test1"
        v-maska:[options]
      ></v-text-field>
      <v-text-field v-maska:[options1]></v-text-field>
      <v-text-field v-maska:[options1] readonly></v-text-field>
      <v-text-field v-maska:[options1] disabled></v-text-field>
      <!-- <UMarkdownViewer>{{ textBox3 }}</UMarkdownViewer> -->
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UMarkdownViewer } from "#moong/nuxt/components";

// @ts-ignore
import textBox3 from "./md/textbox3.md";

const test1 = ref("123456789123456789");
const test2 = ref("abcdefghijklmnopqrstuvwxyz");

const options = { mask: "#-#" };
const options1 = { mask: "######-#######" };
</script>

<style scoped></style>
