<template>
  <VCard>
    <template #text>
      <!-- useOnError 메소드를 사용하여 어플리케이션 런타임 구동 시 발생할 수 있는 에러를 핸들링하는 방법에 대해 안내한다. -->

      <!-- <UMarkdownViewer :content="doc1" /> -->

      <VBtn @click="errorCase1">에러발생 시, alert 발생</VBtn>
      <!-- <UMarkdownViewer :content="doc2" /> -->
      <br />

      <VBtn @click="errorCase2">예외 메시지 정의</VBtn>

      <!-- <UMarkdownViewer :content="doc3" /> -->
      <br />

      <VBtn @click="errorCase3">동적 예외 메시지 정의</VBtn>
      <!-- <UMarkdownViewer :content="doc4" /> -->
      <br />

      <VBtn @click="errorCase4">Toast 메시지 표시</VBtn>
      <!-- <UMarkdownViewer :content="doc5" /> -->

      <br />

      <VBtn @click="errorCase5">다른 화면으로 이동</VBtn>
      <!-- <UMarkdownViewer :content="doc6" /> -->
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { useOnError } from '#ustra/nuxt/composables'

// @ts-ignore
import doc1 from './md/error1-1.md'

// @ts-ignore
import doc2 from './md/error1-2.md'

// @ts-ignore
import doc3 from './md/error1-3.md'

// @ts-ignore
import doc4 from './md/error1-4.md'

// @ts-ignore
import doc5 from './md/error1-5.md'

// @ts-ignore
import doc6 from './md/error1-6.md'

function errorCase1() {
  return useOnError((text: string) => {
    throw new Error('에러 발생')
  })('text')
}

function errorCase2() {
  return useOnError(
    (text: string) => {
      throw new Error('에러 발생')
    },
    {
      message: '에러가 발생하였습니다.',
    },
  )('text')
}

function errorCase3() {
  return useOnError(
    (text: string) => {
      throw new Error('정보를 상세하게 입력해주세요.')
    },
    {
      message: err => `에러 발생 (${err.message})`,
    },
  )('text')
}

function errorCase4() {
  return useOnError(
    (text: string) => {
      throw new Error('정보를 상세하게 입력해주세요.')
    },
    {
      notifyType: 'toast',
    },
  )('text')
}

function errorCase5() {
  return useOnError(
    (text: string) => {
      throw new Error('정보를 상세하게 입력해주세요.')
    },
    {
      notifyType: 'redirect',
      path: '/',
    },
  )('text')
}
</script>
