<template>
  <v-card>
    <template #title>기본 Field</template>
    <template #subtitle> 라벨, 컴포넌트 좌우 </template>
    <template #text>
      <UFieldSet label="검색영역">
        <UFieldRow>
          <UField required label="프로세스 아이디"><v-text-field></v-text-field></UField>
          <UField required label="요청 아이디"><v-text-field></v-text-field> </UField>
        </UFieldRow>
        <UFieldRow>
          <UField required label="인터페이스 아이디"><v-text-field></v-text-field> </UField>
          <UField label="URL"><v-text-field></v-text-field> </UField>
        </UFieldRow>
        <UFieldRow>
          <UField label="채널 코드"><v-text-field></v-text-field> </UField>
          <UField label="성공 여부"><v-text-field></v-text-field> </UField>
        </UFieldRow>
        <UFieldRow>
          <UField label="응답 코드 값"><v-text-field></v-text-field> </UField>
        </UFieldRow>
        <UFieldRow :ratio="[2, 1]">
          <UField label="기간">
            <!-- <UDatePeriodBox /> -->
            <v-text-field type="date"></v-text-field>
          </UField>
          <UField blank>
            <UButtonBox right>
              <v-btn>수정</v-btn>
              <v-btn>삭제</v-btn>
            </UButtonBox>
          </UField>
        </UFieldRow>
      </UFieldSet>
      <!-- <UMarkdownViewer>
        {{ formSample1 }}
      </UMarkdownViewer> -->
    </template>
  </v-card>
</template>

<script setup lang="ts">
import formSample1 from './md/form-sample1.md'
</script>

<style scoped></style>
