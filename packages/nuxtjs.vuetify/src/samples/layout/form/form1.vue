<template>
  <v-card>
    <template #title>기본설정 + Direction (Row)</template>
    <template #subtitle> 기본설정/ Field 비율 설정 / 라벨 좌우 설정 </template>
    <template #text>
      <div class="sample-wrap">
        <UFieldSet label="기본설정">
          <UFieldRow>
            <UField label="필드1(row)"><v-text-field></v-text-field></UField>
            <UField label="필드2(row)"><v-text-field></v-text-field> </UField>
            <UField label="필드3(row)"><v-text-field></v-text-field> </UField>
            <UField label="필드4(row)"><v-text-field></v-text-field> </UField>
          </UFieldRow>
          <UFieldRow>
            <UField label="필드1(row)"><v-text-field></v-text-field></UField>
          </UFieldRow>
        </UFieldSet>
        <UFieldSet label="중요 검색항목 표시 (required 옵션 추가)">
          <UFieldRow>
            <UField required label="필드1(row)"><v-text-field></v-text-field></UField>
            <UField required label="필드2(row)"><v-text-field></v-text-field> </UField>
            <UField label="필드3(row)"><v-text-field></v-text-field> </UField>
            <UField label="필드4(row)"><v-text-field></v-text-field> </UField>
          </UFieldRow>
          <UFieldRow>
            <UField label="필드1(row)"><v-text-field></v-text-field></UField>
          </UFieldRow>
        </UFieldSet>
        <UFieldSet label="Ratio 설정 (ratio 옵션 활용)">
          <UFieldRow>
            <UField label="필드1(row)"><v-text-field></v-text-field></UField>
            <UField label="필드2(row)"><v-text-field></v-text-field> </UField>
            <UField label="필드3(row)"><v-text-field></v-text-field> </UField>
            <UField label="필드4(row)"><v-text-field></v-text-field> </UField>
          </UFieldRow>
          <UFieldRow :ratio="[1, 3]">
            <UField label="필드1(row)"><v-text-field></v-text-field></UField>
            <UField label="필드2(row)"><v-text-field></v-text-field> </UField>
          </UFieldRow>
          <UFieldRow :ratio="[4]">
            <UField label="필드1(row)"><v-text-field></v-text-field></UField>
          </UFieldRow>
        </UFieldSet>
        <UFieldSet label="Ratio 설정 (ratio 옵션 활용 + 고정 px)">
          <UFieldRow :ratio="['300px', 1]">
            <UField label="필드1(row)"><v-text-field></v-text-field></UField>
            <UField label="필드2(row)"><v-text-field></v-text-field> </UField>
          </UFieldRow>
          <UFieldRow :ratio="[1, '500px']">
            <UField label="필드1(row)"><v-text-field></v-text-field></UField>
            <UField label="필드2(row)"><v-text-field></v-text-field> </UField>
          </UFieldRow>
          <UFieldRow :ratio="['300px', 1, 2]">
            <UField label="필드1(row)"><v-text-field></v-text-field></UField>
            <UField label="필드2(row)"><v-text-field></v-text-field> </UField>
            <UField label="필드3(row)"><v-text-field></v-text-field> </UField>
          </UFieldRow>
        </UFieldSet>
        <UFieldSet label="라벨 좌우 설정 (left, right 옵션 추가)">
          <UFieldRow>
            <UField left label="필드1(row)"><v-text-field></v-text-field></UField>
            <UField left label="필드2(row)"><v-text-field></v-text-field> </UField>
            <UField label="필드3(row)"><v-text-field></v-text-field> </UField>
            <UField right label="필드4(row)"><v-text-field></v-text-field> </UField>
          </UFieldRow>
          <UFieldRow :ratio="[1, 3]">
            <UField right label="필드1(row)"><v-text-field></v-text-field></UField>
            <UField left label="필드2(row)"><v-text-field></v-text-field> </UField>
          </UFieldRow>
          <UFieldRow :ratio="[4]">
            <UField label="필드1(row)"><v-text-field></v-text-field></UField>
          </UFieldRow>
        </UFieldSet>
      </div>
      <!-- <UMarkdownViewer>
        {{ form1 }}
      </UMarkdownViewer> -->
    </template>
  </v-card>
</template>

<script setup lang="ts">
import './style/form.scss'
import form1 from './md/form1.md'
</script>

<style scoped></style>
