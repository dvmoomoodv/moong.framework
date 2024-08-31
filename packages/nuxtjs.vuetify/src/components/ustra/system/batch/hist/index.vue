<template>
  <UBox direction="col">
    <UItem>
      <UFieldSet>
        <UFieldRow :ratio="[1, 1, 1, 1]">
          <UField label="배치 이력 아이디">
            <UTextField
              type="text"
              v-model="searchAction.searchParam.batHistId"
            />
          </UField>
          <UField label="배치 아이디">
            <UTextField type="text" v-model="searchAction.searchParam.batId" />
          </UField>
          <UField label="배치 명">
            <UTextField type="text" v-model="searchAction.searchParam.batNm" />
          </UField>
          <UField blank>
            <UButtonBox :right="true">
              <UButton
                class="gray ico_reset"
                @click="searchAction.clearSearchParam"
                ><span class="blind">초기화</span></UButton
              >
              <UButton
                text="조회"
                class="primary ico_search"
                @click="() => searchAction.loadSearchedData()"
              />
            </UButtonBox>
          </UField>
        </UFieldRow>
      </UFieldSet>
    </UItem>

    <UItem :ratio="1">
      <UBox direction="col">
        <VTable>
          <thead>
            <tr>
              <th>배치 이력 아이디</th>
              <th>배치 아이디</th>
              <th>배치 명</th>
              <th>실행시간</th>
              <th>성공 여부</th>
              <th>배치 인스턴스 코드</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="each in data">
              <td>{{ each.batHistId }}</td>
              <td>{{ each.batId }}</td>
              <td>{{ each.batNm }}</td>
              <td>{{ each.accDttm }}</td>
              <td>{{ each.succYn }}</td>
              <td>{{ each.batInstCd }}</td>
              <td>
                <UButton
                  text="로그"
                  class="primary ico_search"
                  @click="() => gridAction.printLog(each.batHistId)"
                />
              </td>
            </tr>
          </tbody>
        </VTable>
        <LogPopup
          v-model="gridAction.logShow.value"
          :batHistId="gridAction.logBatHistId.value"
        />
      </UBox>
    </UItem>
  </UBox>
</template>
<script lang="ts" setup>
import {
  ref,
  reactive,
  watch,
  onMounted,
  useOnError,
  provide,
  inject,
  shallowRef,
  computed,
} from "#moong/nuxt";
import {
  BatchHistCriteria,
  BatchHist,
  useUstraBatchHistService,
} from "#moong/nuxt/management";
import LogPopup from "./popup.vue";
import UButton from "#moong/nuxt-vuetify/components/button/u-button.vue";
import UMessage from "#moong/nuxt-vuetify/components//message/u-message.vue";

import UVCodeComboBox from "#moong/nuxt-vuetify/management/components/combo-box/u-v-code-combo-box.vue";
import UVRadioGroupBox from "#moong/nuxt-vuetify/components/radio/u-v-radio-group-box.vue";

const service = useUstraBatchHistService();
const searchAction = (function () {
  const searchParam: BatchHistCriteria = reactive({
    batHistId: null,
    batId: null,
    batNm: null,
  });

  function clearSearchParam() {
    searchParam.batHistId = null;
    searchParam.batId = null;
    searchParam.batNm = null;
  }

  async function loadSearchedData(batId?: string) {
    if (batId) {
      searchParam.batId = batId;
    }
    gridAction.histGrid.pagination.loadPageData(1);
  }

  return {
    searchParam,
    clearSearchParam,
    loadSearchedData,
  };
})();

const gridAction = (function () {
  function renderUsePeroid(data: BatchHist) {
    if (!data.srtDttm) {
      return "";
    }

    if (!data.endDttm) {
      return `${$ustra.utils.formatting.datetime(data.srtDttm)} ~`;
    }

    return `${$ustra.utils.formatting.datetime(data.srtDttm)} ~ ${$ustra.utils.formatting.datetime(data.endDttm)}`;
  }

  const logShow = ref(false);
  const logBatHistId = ref(null);
  function printLog(batHistId: string) {
    logShow.value = true;
    logBatHistId.value = batHistId;
  }

  return {
    renderUsePeroid,
    printLog,
    logShow,
    logBatHistId,
  };
})();

defineExpose({
  searchAction,
});
</script>
<script lang="ts">
export default {
  name: "UstraManagementSystemBatchHist",
};
</script>
<style scoped></style>
