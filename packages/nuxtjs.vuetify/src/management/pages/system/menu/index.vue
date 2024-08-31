<template>
  <UBox direction="col">
    <UItem>
      <UFieldSet>
        <UFieldRow>
          <UField label="시스템" totalWidth="400">
            <UVCodeComboBox v-model="selectedSystemCode"
                            grpCd="SYS_CD" />
          </UField>
        </UFieldRow>
      </UFieldSet>
    </UItem>
    <UItem ratio="1">
      <!-- <VTabs v-model="tab" bg-color="primary">
        <VTab value="tab1">메뉴 관리</VTab> -->
        <!-- <VTab value="tab2">일괄 관리</VTab> -->
      <!-- </VTabs> -->
      <ManagementTab :sysCd="selectedSystemCode"/>
    </UItem>
    <!-- <VWindow v-model="tab">
      <VWindowItem value="tab1">
        <UBox direction="row" height="100%">
          <UItem ratio="1">
            <ManagementTab />
          </UItem>
        </UBox>
      </VWindowItem>
      <VWindowItem value="tab2">
        <UBox direction="row" height="100%">
          <UItem ratio="1"> -->
            <!-- <User :systemCode="selectedSystemCode.dtlCd" /> -->
          <!-- </UItem>
        </UBox>
      </VWindowItem> -->
    <!-- </VWindow> -->
  </UBox>
</template>
<script setup lang="ts">
import treeview from 'vue3-treeview'
import 'vue3-treeview/dist/style.css'
import UVCodeComboBox from '#ustra/nuxt-vuetify/management/components/combo-box/u-v-code-combo-box.vue'
import ManagementTab from './management-tab.vue'

const selectedSystemCode = ref<string>('BO')
const tab = ref('tab1')

definePageMeta({
  layout: 'ustra'
})
</script>
