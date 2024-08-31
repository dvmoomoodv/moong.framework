<template>
  <UBox direction="col">
    <UItem :ratio="1">
      <VTabs v-model="tab" bg-color="primary">
        <VTab value="tab1">로그인 이력</VTab>
        <VTab value="tab2">접속 횟수</VTab>
      </VTabs>
      <VWindow v-model="tab">
        <VWindowItem value="tab1">
          <UBox direction="row" height="100%">
            <UItem ratio="1">
              <LoginHist />
            </UItem>
          </UBox>
        </VWindowItem>

        <VWindowItem value="tab2">
          <UBox direction="row" height="100%">
            <UItem ratio="1">
              <AccCnt v-if="tab === 'tab2'" />
            </UItem>
          </UBox>
        </VWindowItem>
      </VWindow>
    </UItem>
  </UBox>
</template>
<script lang="ts" setup>
import { ref } from "#moong/nuxt";
import LoginHist from "./login-hist/index.vue";
import AccCnt from "./acc-cnt/index.vue";

const tab = ref("tab1");
definePageMeta({
  layout: "ustra",
});
</script>
<script lang="ts">
export default {
  name: "UstraManagementSystemUserAccHist",
};
</script>
<style lang="scss">
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
