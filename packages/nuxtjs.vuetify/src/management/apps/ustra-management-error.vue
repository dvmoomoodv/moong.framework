<template>
  <div class="errorContainer">
    <div class="fixed left-0 right-0 spotlight"></div>
    <div class="box">
      <h1>{{ statusCode }}</h1>
      <h3 class="mt-5">{{ statusMessage }}</h3>
      <div class="mt-5">{{ description }}</div>
      <div v-if="stack" class="stack" v-html="stack"></div>

      <UButtonBar backgroundColor="transparent" class="mt-10">
        <UButtonBox center>
          <UButton
            text="홈 화면으로"
            type="primary"
            @click="
              () => {
                clearError().then(() => $ustra.global.location.replace('/'))
              }
            "
          />
          <UButton
            text="이전 화면으로"
            @click="
              () => {
                clearError().then(() => $ustra.global.history.back())
              }
            "
          />
        </UButtonBox>
      </UButtonBar>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { clearError } from '#app'

const { error } = defineProps<{
  error: any
}>()

const statusCode = Number(error.statusCode || 500)
const is404 = statusCode === 404
const statusMessage = is404 ? '요청된 경로를 찾을 수 없습니다.' : '서버 오류가 발생하였습니다.'
const description = error.message || error.toString()
const stacktrace = (error.stack || '')
  .split('\n')
  .splice(1)
  .map(line => {
    const text = line.replace('webpack:/', '').replace('.vue', '.js').trim()
    return {
      text,
      internal: (line.includes('node_modules') && !line.includes('.cache')) || line.includes('internal') || line.includes('new Promise'),
    }
  })
  .map(i => `<span class="stack${i.internal ? ' internal' : ''}">${i.text}</span>`)
  .join('\n')

const stack = process.dev && !is404 ? error.description || `<pre>${stacktrace}</pre>` : undefined
</script>
<style scoped>
.errorContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.errorContainer .box .stack {
  margin: 5px 0;
  padding: 10px;
  border: 1px dashed #0056d6;
}

.spotlight {
  background: linear-gradient(45deg, #00dc82 0%, #36e4da 50%, #0047e1 100%);
  opacity: 0.8;
  filter: blur(30vh);
  height: 60vh;
  bottom: -40vh;
  position: fixed;
  left: 0;
  right: 0;
}
</style>
