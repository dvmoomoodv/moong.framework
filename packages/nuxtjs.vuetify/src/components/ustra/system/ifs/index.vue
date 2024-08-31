<template>
  <UBox direction="col">
    <UItem :ratio="1">
      <VTabs v-model="tab" bg-color="primary">
        <VTab value="IN">인바운드</VTab>
        <VTab value="OUT">아웃바운드</VTab>
      </VTabs>
      <VWindow v-model="tab">
        <VWindowItem value="IN">
          <UBox direction="row" height="100%">
            <UItem ratio="1">
              <IfPage tabType="IN" v-if="tab === 'IN'" />
            </UItem>
          </UBox>
        </VWindowItem>

        <VWindowItem value="OUT">
          <UBox direction="row" height="100%">
            <UItem ratio="1">
              <IfPage tabType="OUT" v-if="tab === 'OUT'" />
            </UItem>
          </UBox>
        </VWindowItem>
      </VWindow>
    </UItem>
  </UBox>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import IfPage from './if-page.vue'

const tab = ref('IN')
</script>

<script lang="ts">
export default {
  name: 'UstraManagementInterfaceInfo',
}
</script>

<style lang="scss" scoped>
.menu-tab-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.menu-tab-panel > div:nth-of-type(3) {
  flex: 1 1 100%;
  display: flex;
  flex-direction: column;

  & .wj-tabpanes {
    flex: 1 1 100%;
  }
}
</style>
