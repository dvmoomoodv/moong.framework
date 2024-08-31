<template>
  <UBox direction="col">
    <UItem :ratio="1">
      <VTabs v-model="tab" bg-color="primary">
        <VTab value="tab1">배치 작업</VTab>
        <VTab value="tab2">배치 작업 내역</VTab>
        <VTab value="tab3">배치 매니저</VTab>
        <VTab value="tab4">배치 워커</VTab>
      </VTabs>
      <VWindow v-model="tab">
        <VWindowItem value="tab1">
          <UBox direction="row" height="100%">
            <UItem ratio="1">
              <BatchTask />
            </UItem>
          </UBox>
        </VWindowItem>

        <VWindowItem value="tab2">
          <UBox direction="row" height="100%">
            <UItem ratio="1">
              <BatchHist />
            </UItem>
          </UBox>
        </VWindowItem>

        <VWindowItem value="tab3">
          <UBox direction="row" height="100%">
            <UItem ratio="1">
              <BatchManager />
            </UItem>
          </UBox>
        </VWindowItem>

        <VWindowItem value="tab4">
          <UBox direction="column" height="100%">
            <UItem ratio="1">
              <BatchWorker />
            </UItem>
          </UBox>
        </VWindowItem>
      </VWindow>
    </UItem>
  </UBox>
</template>
<script lang="ts" setup>
import { ref } from "#moong/nuxt";
import BatchTask from "./task/index.vue";
import BatchHist from "./hist/index.vue";
import BatchManager from "./manager/index.vue";
import BatchWorker from "./worker/index.vue";

const tab = ref("tab1");
</script>
<script lang="ts">
export default {
  name: "UstraManagementSystemBatch",
};
</script>
<style lang="scss">
.menu-tab-panel {
  width: 100%;
  // height: 100%;
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
