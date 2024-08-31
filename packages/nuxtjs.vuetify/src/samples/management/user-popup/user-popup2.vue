<template>
  <VCard>
    <template #text>
      <h3>다중 선택</h3>
      <br />
      multiple 속성을 true로 설정하여 여러 사용자를 선택하여 가져올 수 있다.
      <br /><br />
      <VBtn @click="() => (showPopup = true)">팝업오픈</VBtn>
      <br />
      <UVUserPopup v-model="showPopup" :multiple="true" @selected="data => (selectedItem = data)" />

      <br />
      <v-chip class="ma-2" color="pink" label text-color="white" style="height: auto; overflow: auto; white-space: normal">
        <v-icon start icon="mdi-label"></v-icon>
        selectedItem : {{ selectedItem }}
      </v-chip>
    </template>
  </VCard>
</template>
<script lang="ts" setup>
import { ref } from '#ustra/nuxt'
import UVUserPopup from '#ustra/nuxt-vuetify/management/components/popup/u-v-user-popup.vue'

// @ts-ignore
import userPopup2 from './md/user-popup2.md'

const showPopup = ref(false)
const selectedItem = ref(null)
</script>
