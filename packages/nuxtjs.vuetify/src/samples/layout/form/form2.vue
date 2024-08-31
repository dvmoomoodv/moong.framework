<template>
  <v-card>
    <template #title>Direction (Column)</template>
    <template #subtitle>기본설정과 Field 비율 설정 </template>
    <template #text>
      <div class="sample-wrap">
        <UFieldSet label="기본설정">
          <UFieldRow>
            <UField label="필드1(col)" direction="col"><v-text-field></v-text-field></UField>
            <UField label="필드2(col)" direction="col"><v-text-field></v-text-field> </UField>
            <UField label="필드3(col)" direction="col"><v-text-field></v-text-field> </UField>
          </UFieldRow>
          <UFieldRow>
            <UField label="필드1(col)" direction="col"><v-text-field></v-text-field></UField>
            <UField label="필드2(col)" direction="col"><v-text-field></v-text-field> </UField>
          </UFieldRow>
        </UFieldSet>
        <UFieldSet label="Ratio 설정">
          <UFieldRow :ratio="[1, 1, 2]">
            <UField label="필드1(col)" direction="col"><v-text-field></v-text-field></UField>
            <UField label="필드2(col)" direction="col"><v-text-field></v-text-field> </UField>
            <UField label="필드3(col)" direction="col"><v-text-field></v-text-field> </UField>
          </UFieldRow>
          <UFieldRow :ratio="['300px', 2]">
            <UField label="필드1(col)" direction="col"><v-text-field></v-text-field></UField>
            <UField label="필드2(col)" direction="col"><v-text-field></v-text-field> </UField>
          </UFieldRow>
        </UFieldSet>
      </div>
      <!-- <UMarkdownViewer>
        {{ form2 }}
      </UMarkdownViewer> -->
    </template>
  </v-card>
</template>

<script setup lang="ts">
import './style/form.scss'
import form2 from './md/form2.md'
</script>

<style scoped></style>
