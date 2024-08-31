<template>
  <v-card>
    <template #title> Field 안에 여러개 컴포넌트 추가 - itemDirection </template>
    <template #subtitle> itemDirection 속성으로 컴포넌트 나열 방법 변경 (기본 : col)</template>
    <template #text>
      <div class="sample-wrap">
        <UFieldSet label="1단 구조">
          <UFieldRow>
            <UField label="필드1" direction="row">
              <v-text-field></v-text-field>
              <v-text-field></v-text-field>
            </UField>
          </UFieldRow>
          <UFieldRow>
            <UField label="필드1" direction="row" itemDirection="row">
              <v-text-field></v-text-field>
              <v-text-field></v-text-field>
            </UField>
          </UFieldRow>
          <UFieldRow>
            <UField label="필드2" direction="col">
              <v-text-field></v-text-field>
              <v-text-field></v-text-field>
            </UField>
          </UFieldRow>
          <UFieldRow>
            <UField label="필드2" direction="col" itemDirection="row">
              <v-text-field></v-text-field>
              <v-text-field></v-text-field>
            </UField>
          </UFieldRow>
        </UFieldSet>
        <UFieldSet label="2단 구조">
          <UFieldRow>
            <UField label="필드1" direction="row">
              <v-text-field></v-text-field>
              <v-text-field></v-text-field>
            </UField>
            <UField label="필드1" direction="row" itemDirection="row">
              <v-text-field></v-text-field>
              <v-text-field></v-text-field>
            </UField>
          </UFieldRow>
          <UFieldRow>
            <UField label="필드2" direction="col">
              <v-text-field></v-text-field>
              <v-text-field></v-text-field>
            </UField>
            <UField label="필드2" direction="col" itemDirection="row">
              <v-text-field></v-text-field>
              <v-text-field></v-text-field>
            </UField>
          </UFieldRow>
        </UFieldSet>
      </div>
      <!-- <UMarkdownViewer>
        {{ form6 }}
      </UMarkdownViewer> -->
    </template>
  </v-card>
</template>

<script setup lang="ts">
import './style/form.scss'
import form6 from './md/form6.md'
</script>

<style scoped></style>
