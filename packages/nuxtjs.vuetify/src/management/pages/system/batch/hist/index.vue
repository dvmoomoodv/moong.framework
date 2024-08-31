<template>
  <UBox direction="col">
    <UItem>
      <UFieldSet>
        <UFieldRow :ratio="[1, 1, 1, 1]">
          <UField label="배치 이력 아이디">
            <VTextField
              type="text"
              v-model="searchAction.searchParam.batHistId"
            />
          </UField>
          <UField label="배치 아이디">
            <VTextField type="text" v-model="searchAction.searchParam.batId" />
          </UField>
          <UField label="배치 명">
            <VTextField type="text" v-model="searchAction.searchParam.batNm" />
          </UField>
          <UField blank>
            <VBtnBox :right="true">
              <VBtn
                text="초기화"
                class="gray ico_reset"
                @click="searchAction.clearSearchParam"
              />
              <VBtn
                text="조회"
                class="primary ico_search"
                @click="() => searchAction.loadSearchedData()"
              />
            </VBtnBox>
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
                <VBtn
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
