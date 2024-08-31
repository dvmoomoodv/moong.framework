<template>
  <UBox direction="col">
    <UItem>
      <UFieldSet>
        <UFieldRow :ratio="[1, 1, 2]">
          <UField label="워커 아이디">
            <VTextField
              type="text"
              v-model="searchAction.searchParam.workerId"
            />
          </UField>
          <UField label="엔드포인트">
            <VTextField
              type="text"
              v-model="searchAction.searchParam.endpoint"
            />
          </UField>
          <UField blank>
            <UButtonBox right>
              <VBtn
                text="초기화"
                class="gray ico_reset"
                @click="searchAction.clearSearchParam"
              />
              <VBtn
                text="조회"
                class="primary ico_search"
                @click="searchAction.loadSearchedData"
              />
              <VBtn text="신규" @click="formAction.newForm" />
            </UButtonBox>
          </UField>
        </UFieldRow>
      </UFieldSet>
    </UItem>
    <UItem>
      <UBox direction="row" style="gap: 5px">
        <UItem :ratio="5">
          <VTable>
            <thead>
              <tr>
                <th>워커 아이디</th>
                <th>엔드포인트</th>
                <th>수용량</th>
                <th>사용 여부</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="each in data">
                <td>{{ each.workerId }}</td>
                <td>{{ each.endpoint }}</td>
                <td>{{ each.capacity }}</td>
                <td>{{ each.enabled }}</td>
              </tr>
            </tbody>
          </VTable>
        </UItem>
        <UItem :ratio="5" :disabled="formAction.formDisabled.value">
          <UFieldSet>
            <UFieldRow>
              <UField label="워커 아이디" required>
                <VTextField
                  v-model="formAction.inputData.workerId"
                  :isDisabled="formAction.mode.value === 'update'"
                  :validation="{ rules: [formAction.validateId] }"
                />
              </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="엔드포인트" required
                ><VTextField v-model="formAction.inputData.endpoint" />
              </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="수용량" required
                ><VTextField v-model="formAction.inputData.capacity" />
              </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="사용 여부" required
                ><UVRadioGroupBox
                  v-model="formAction.inputData.enabled"
                  :itemsSource="searchAction.enabledList"
                />
              </UField>
            </UFieldRow>

            <UFieldRow :ratio="[1, 1]">
              <UField direction="col">
                <UButtonBox :left="true">
                  <VBtn
                    text="시작"
                    mdiIconColor="gray"
                    :width="80"
                    :disabled="formAction.mode.value === 'new'"
                    @click="formAction.enable"
                  />
                  <VBtn
                    text="중지"
                    mdiIconColor="gray"
                    :width="80"
                    :disabled="formAction.mode.value === 'new'"
                    @click="formAction.disable"
                  />
                </UButtonBox>
              </UField>
              <UField direction="col">
                <UButtonBox :right="true">
                  <VBtn text="저장" @click="formAction.saveForm" />
                  <VBtn
                    text="삭제"
                    :disabled="formAction.mode.value === 'new'"
                    @click="formAction.deleteForm"
                  />
                </UButtonBox>
              </UField>
            </UFieldRow>
          </UFieldSet>
        </UItem>
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
  nextTick,
} from "#moong/nuxt";
import { baseModels } from "#moong/core/data";
import {
  BatchWorker,
  BatchWorkerCriteria,
  useUstraBatchWorkerService,
} from "#moong/nuxt/management";

import UVRadioGroupBox from "#moong/nuxt-vuetify/components/radio/u-v-radio-group-box.vue";
const service = useUstraBatchWorkerService();

onMounted(async () => {
  await nextTick();
  formAction.saved();
});

const searchAction = (function () {
  const searchParam: BatchWorkerCriteria = reactive({
    workerId: null,
    endpoint: null,
  });

  function clearSearchParam() {
    searchParam.workerId = null;
    searchParam.endpoint = null;
  }

  async function loadSearchedData() {
    formAction.saved();
  }

  const enabledList = reactive([
    { value: true, text: "사용" },
    { value: false, text: "미사용" },
  ]);

  return {
    searchParam,
    clearSearchParam,
    loadSearchedData,
    enabledList,
  };
})();

const data = ref([]);
const gridAction = (function () {
  async function loadData() {
    const result = await service.getWorkerList({
      ...searchAction.searchParam,
    });
    data.value = result.body;
  }

  return {
    loadData,
  };
})();

const formAction = (function () {
  const mode = ref<baseModels.FormMode>("new");
  const formDisabled = ref(true);

  const inputData: BatchWorker = reactive({
    workerId: null,
    endpoint: null,
    capacity: 1,
    enabled: false,
  });

  async function init() {
    mode.value = "new";

    Object.assign(inputData, {
      workerId: null,
      endpoint: null,
      capacity: 1,
      enabled: false,
    });
  }

  async function updateForm(BatchWorker: BatchWorker) {
    mode.value = "update";
    Object.assign(inputData, BatchWorker);
    formDisabled.value = false;
  }

  function newForm() {
    formDisabled.value = false;
    init();
    gridAction.grid.selection.clear();
  }

  const saveForm = useOnError(
    async () => {
      const realInputData = $ustra.utils.core.deepMerge({}, inputData);

      if (mode.value === "new") {
        await service.createWorker({
          header: {},
          batchWorker: { ...realInputData },
        });
      } else {
        await service.modifyWorker({
          header: {},
          batchWorker: { ...realInputData },
        });
      }

      saved();
    },
    {
      // message: Error.message,
    }
  );

  async function deleteForm() {
    const realInputData = $ustra.utils.core.deepMerge({}, inputData);

    if (await confirm("삭제하시겠습니까?")) {
      await service.deleteWorker({
        header: {},
        workerId: realInputData.workerId,
      });
      saved();
    }
  }

  async function enable() {
    const realInputData = $ustra.utils.core.deepMerge({}, inputData);
    await service.enableWorker({
      header: {},
      batchWorker: { ...realInputData },
    });
    saved();
  }

  async function disable() {
    const realInputData = $ustra.utils.core.deepMerge({}, inputData);
    await service.disableWorker({
      header: {},
      batchWorker: { ...realInputData },
    });
    saved();
  }

  async function saved() {
    formDisabled.value = true;
    init();
    gridAction.loadData();
  }

  async function validateId(workerId: string) {
    return true;
  }

  return {
    mode,
    inputData,
    init,
    formDisabled,
    saveForm,
    validateId,
    newForm,
    updateForm,
    deleteForm,
    saved,
    enable,
    disable,
  };
})();
</script>
<script lang="ts">
export default {
  name: "UstraManagementSystemBatchWorker",
};
</script>
<style scoped></style>
