<template>
  <UBox direction="col">
    <UItem>
      <UFieldSet>
        <UFieldRow>
          <UField label="시스템" totalWidth="400">
            <UVCodeComboBox v-model="selectedSystemCode" grpCd="SYS_CD" />
          </UField>
        </UFieldRow>
      </UFieldSet>
    </UItem>
    <UItem ratio="1">
      <VTabs v-model="tab" bg-color="primary">
        <VTab value="tab1">그룹별 권한 설정</VTab>
        <VTab value="tab2">사용자별 권한 설정</VTab>
      </VTabs>
    </UItem>
    <VWindow v-model="tab">
      <VWindowItem value="tab1">
        <UBox direction="row" height="100%">
          <UItem ratio="1">
            <Group :systemCode="selectedSystemCode" />
          </UItem>
        </UBox>
      </VWindowItem>
      <VWindowItem value="tab2">
        <UBox direction="row" height="100%">
          <UItem ratio="1">
            <User :systemCode="selectedSystemCode" />
          </UItem>
        </UBox>
      </VWindowItem>
    </VWindow>
  </UBox>
</template>
<script setup lang="ts">
import { useExposed } from '#ustra/nuxt/composables'
import UVCodeComboBox from '#ustra/nuxt-vuetify/management/components/combo-box/u-v-code-combo-box.vue'
import treeview from 'vue3-treeview'
import 'vue3-treeview/dist/style.css'
import Group from './groups.vue'
import User from './user.vue'
import DatePicker from '#ustra/nuxt-vuetify/components/date-picker.vue'

const canHasAuthorityByUser = computed(() => $ustra.management.serverAppProps.canHasAuthorityByUser)

const selectedSystemCode = ref<string>(null)

const tab = ref('tab1')
const config = reactive({
  roots: ['id1', 'id2'],
})
const nodes = reactive({
  id1: {
    text: 'text1',
    children: ['id11', 'id12'],
  },
  id11: {
    text: 'text11',
  },
  id12: {
    text: 'text12',
  },
  id2: {
    text: 'text2',
  },
})
definePageMeta({
  layout: 'ustra',
})
</script>
