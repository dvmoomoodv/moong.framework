<template>
  <UBox direction="col">
    <UItem>
      <UFieldSet>
        <UFieldRow :ratio="[1, 3]">
          <UField label="매니저 아이디">
            <UTextBox
              type="text"
              v-model="searchAction.searchParam.managerId"
            />
          </UField>
          <UField blank>
            <UButtonBox>
              <UButton
                class="gray ico_reset"
                @click="searchAction.clearSearchParam"
                ><span class="blind">초기화</span></UButton
              >
              <UButton
                text="조회"
                class="primary ico_search"
                @click="searchAction.loadSearchedData"
              />
              <UButton text="신규" @click="formAction.newForm" />
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
                <td>매니저 아이디</td>
                <td>엔드포인트</td>
                <td>마스터 여부</td>
                <td>사용 여부</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="each in data">
                <td>{{ each.managerId }}</td>
                <td>{{ each.endpoint }}</td>
                <td>{{ each.master }}</td>
                <td>{{ each.enabled }}</td>
              </tr>
            </tbody>
          </VTable>
        </UItem>
        <UItem :ratio="5" :disabled="formAction.formDisabled.value">
          <UFieldSet>
            <UFieldRow>
              <UField label="매니저 아이디" required>
                <VTextField
                  v-model="formAction.inputData.managerId"
                  :isDisabled="formAction.mode.value === 'update'"
                  :validation="{ rules: [formAction.validateId] }"
                />
              </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="엔드포인트"
                ><VTextField
                  type="textarea"
                  noResize
                  :isRequired="false"
                  v-model="formAction.inputData.endpoint"
                />
              </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="마스터 여부" required
                ><UVRadioGroupBox
                  v-model="formAction.inputData.master"
                  :itemsSource="searchAction.masterList"
                />
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
            <UButtonBox :right="true">
              <UButton text="저장" @click="formAction.saveForm" />
              <UButton
                text="삭제"
                :disabled="formAction.mode.value === 'new'"
                @click="formAction.deleteForm"
              />
            </UButtonBox>
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
  BatchManager,
  BatchManagerCriteria,
  useUstraBatchManagerService,
} from "#moong/nuxt/management";

import UButton from "#moong/nuxt-vuetify/components/button/u-button.vue";
import UMessage from "#moong/nuxt-vuetify/components/message/u-message.vue";

import UVCodeComboBox from "#moong/nuxt-vuetify/management/components/combo-box/u-v-code-combo-box.vue";
import UVRadioGroupBox from "#moong/nuxt-vuetify/components/radio/u-v-radio-group-box.vue";

const service = useUstraBatchManagerService();

onMounted(async () => {
  await nextTick();
  formAction.saved();
});

const searchAction = (function () {
  const searchParam: BatchManagerCriteria = reactive({
    managerId: null,
  });

  function clearSearchParam() {
    searchParam.managerId = null;
  }

  async function loadSearchedData() {
    formAction.saved();
  }

  const masterList = reactive([
    { value: true, text: "Active" },
    { value: false, text: "Stand By" },
  ]);

  const enabledList = reactive([
    { value: true, text: "사용" },
    { value: false, text: "미사용" },
  ]);

  return {
    searchParam,
    clearSearchParam,
    loadSearchedData,
    masterList,
    enabledList,
  };
})();

const data = ref([]);
const gridAction = (function () {
  async function loadData() {
    const result = await service.getManagerList({
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

  const inputData: BatchManager = reactive({
    managerId: null,
    endpoint: null,
    master: false,
    enabled: false,
  });

  async function init() {
    mode.value = "new";

    Object.assign(inputData, {
      managerId: null,
      endpoint: null,
      master: false,
      enabled: false,
    });
  }

  async function updateForm(batchManager: BatchManager) {
    mode.value = "update";
    Object.assign(inputData, batchManager);
    formDisabled.value = false;
  }

  function newForm() {
    formDisabled.value = false;
    init();
  }

  const saveForm = useOnError(
    async () => {
      const realInputData = $ustra.utils.core.deepMerge({}, inputData);

      if (mode.value === "new") {
        await service.createManager({
          header: {},
          batchManager: { ...realInputData },
        });
      } else {
        await service.modifyManager({
          header: {},
          batchManager: { ...realInputData },
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
      await service.deleteManager({ managerId: realInputData.managerId });
      saved();
    }
  }

  async function saved() {
    formDisabled.value = true;
    init();
    gridAction.loadData();
  }

  async function validateId(managerId: string) {
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
  };
})();
</script>
<script lang="ts">
export default {
  name: "UstraManagementSystemBatchManager",
};
</script>
<style scoped></style>
