<template>
  <VCard>
    <template #text>
      <h3>Source Editing</h3>
      <br />
      useSourceEditing 속성을 true로 설정하면 HTML 소스를 수정할 수 있는 툴바 아이콘이 생성되며 HTML 소스를 직접 변경할 수 있다.
      <br /><br />

      <UCkEditor5 v-model="content" :initialized="ckEditor.initialize" :height="300" :useSourceEditing="true" />

      <!-- <UMarkdownViewer :content="doc1" /> -->

      <v-chip class="ma-2" color="pink" label text-color="white" style="height: auto; overflow: auto; white-space: normal">
        <v-icon start icon="mdi-label"></v-icon>
        content :
        <pre>{{ content }}</pre>
      </v-chip>

      <br /><br />
      <!-- <UMarkdownViewer :content="doc2" /> -->
      <br /><br />

      <div class="mb-2">
        <VBtn @click="() => $ustra.dom.window.alert(ckEditor.sourceEditing.isEditingMode.value)">소스에디팅 여부 확인</VBtn>
        <UButton
          :text="ckEditor.sourceEditing.isEditingMode.value ? '에디터종료' : '에디터오픈'"
          @click="() => (ckEditor.sourceEditing.isEditingMode.value = !ckEditor.sourceEditing.isEditingMode.value)"
        />
      </div>
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { ref, computed } from '#ustra/nuxt'
import { UCkEditor5 } from '#ustra/nuxt-ckeditor5/components'
import { useUstraCkEditor5 } from '#ustra/nuxt-ckeditor5/composables'

// @ts-ignore
import doc1 from './md/editor3.md'

// @ts-ignore
import doc2 from './md/editor3-2.md'

const ckEditor = useUstraCkEditor5()
const content = ref('')
</script>
