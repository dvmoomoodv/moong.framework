<template>
  <UBox direction="col">
    <UItem>
      <UFieldSet>
        <UFieldRow :ratio="[1, 1, 2]">
          <UField label="배치 아이디">
            <VTextField type="text" v-model="searchAction.searchParam.batId" />
          </UField>
          <UField label="배치 명">
            <VTextField type="text" v-model="searchAction.searchParam.batNm" />
          </UField>
          <UField blank>
            <UButtonBox>
              <VBtn text="초기화" class="gray ico_reset" @click="searchAction.clearSearchParam" />
              <VBtn text="조회" class="primary ico_search" @click="searchAction.loadSearchedData" />
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
                <th>배치 아이디</th>
                <th>배치 명</th>
                <th>사용 여부</th>
                <th>중복 실행 가능 여부</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="each in data">
                <td>{{ each.taskId }}</td>
                <td>{{ each.taskNm }}</td>
                <td>{{ each.useYn }}</td>
                <td></td>
              </tr>
            </tbody>
          </VTable>
        </UItem>
        <UItem :ratio="5" :disabled="formAction.formDisabled.value">
          <UFieldSet>
            <UFieldRow>
              <UField label="배치 아이디" required>
                <VTextField
                  v-model="formAction.inputData.batId"
                  :isDisabled="formAction.mode.value === 'update'"
                  :validation="{ rules: [formAction.validateId] }"
                />
              </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="배치 명"><VTextField :isRequired="false" v-model="formAction.inputData.batNm" /> </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="배치 설명"><VTextField :isRequired="false" type="textarea" noResize v-model="formAction.inputData.batDesc" /> </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="사용 여부" required
                ><UVRadioGroupBox v-model="formAction.inputData.useYn" :itemsSource="searchAction.useYnItems" />
              </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="스케줄 구분 코드">
                <uVCodeComboBox :isRequired="false" grpCd="SCHDL_DV_CD" v-model="formAction.inputData.schdlDvCd" displayNullText="선택" />
              </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="스케줄 값">
                <VTextField :isRequired="false" v-model="formAction.inputData.schdlVal" />
              </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="중복 실행 여부" required>
                <UVRadioGroupBox v-model="formAction.inputData.dupExecAvlYn" :itemsSource="searchAction.avlYnItems" />
              </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="지연 시간(S)"><VTextField :isRequired="false" v-model="formAction.inputData.dlyS" /> </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="인스턴스 코드">
                <VCombobox :isRequired="false" v-model="formAction.inputData.batInstCd" :items="searchAction.workerItems.value" multiple />
              </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="입력 정보" v-if="formAction.mode.value === 'update'">
                <b
                  >{{ $ustra.utils.formatting.datetime(formAction.inputData.regDttm, 'yyyy-MM-dd hh:mm:ss') }} /
                  {{ formAction.inputData.regUsrId }} / {{ formAction.inputData.regUsrIp }}
                </b>
              </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="수정 정보" v-if="formAction.mode.value === 'update'">
                <b
                  >{{ $ustra.utils.formatting.datetime(formAction.inputData.updDttm, 'yyyy-MM-dd hh:mm:ss') }} /
                  {{ formAction.inputData.updUsrId }} / {{ formAction.inputData.updUsrIp }}
                </b>
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
                    @click="formAction.batchStart"
                  />
                </UButtonBox>
              </UField>
              <UField direction="col">
                <UButtonBox :right="true">
                  <VBtn text="저장" @click="formAction.saveForm" />
                  <VBtn text="삭제" :disabled="formAction.mode.value === 'new'" @click="formAction.deleteForm" />
                </UButtonBox>
              </UField>
            </UFieldRow>
          </UFieldSet>
        </UItem>
      </UBox>
    </UItem>
    <UItem :ratio="0" height="100%">
      <template #default>
        <UPopup v-model="formAction.histShow.value" title="배치 이력 조회">
          <UBox direction="col" height="100%">
            <UItem :ratio="1">
              <template #default>
                <BatchHist ref="batchHistComp" />
              </template>
            </UItem>
          </UBox>
        </UPopup>
      </template>
    </UItem>
  </UBox>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, onMounted, useOnError, provide, inject, shallowRef, computed, nextTick } from '#ustra/nuxt'
import { baseModels } from '#ustra/core/data'
import { BatchCriteria, Batch, useUstraBatchService, useUstraBatchWorkerService } from '#ustra/nuxt/management'
import BatchHist from '../hist/index.vue'

import UVRadioGroupBox from '#ustra/nuxt-vuetify/components/radio/u-v-radio-group-box.vue'
import uVCodeComboBox from '#ustra/nuxt-vuetify/management/components/combo-box/u-v-code-combo-box.vue'

const service = useUstraBatchService()
const workerService = useUstraBatchWorkerService()
const batchHistComp = ref<InstanceType<typeof BatchHist>>()

onMounted(async () => {
  formAction.saved()

  // const result = (await workerService.getWorkerList({})).body
  searchAction.workerItems.value = ['W01', 'W02']
  // searchAction.workerItems.value = result.map(item => {
  //   return item.workerId
  // })
})

const searchAction = (function () {
  const searchParam: BatchCriteria = reactive({
    batId: null,
    batNm: null,
  })

  function clearSearchParam() {
    searchParam.batId = null
    searchParam.batNm = null
  }

  async function loadSearchedData() {
    formAction.saved()
  }

  const useYnItems = reactive([
    { value: 'Y', text: '사용' },
    { value: 'N', text: '미사용' },
  ])

  const avlYnItems = reactive([
    { value: 'Y', text: '가능' },
    { value: 'N', text: '불가능' },
  ])

  const workerItems = ref<string[]>([])

  return {
    searchParam,
    clearSearchParam,
    loadSearchedData,
    useYnItems,
    avlYnItems,
    workerItems,
  }
})()

const data = ref([])
const gridAction = (function () {
  async function loadData() {
    const result = await service.getBatchList({
      ...searchAction.searchParam,
    })
    data.value = result.body
  }

  return {
    loadData,
  }
})()

const formAction = (function () {
  const mode = ref<baseModels.FormMode>('new')
  const formDisabled = ref(true)

  const inputData = reactive({
    batId: null,
    batNm: null,
    batDesc: null,
    useYn: 'Y',
    schdlDvCd: null,
    schdlVal: null,
    dupExecAvlYn: 'N',
    dlyS: 0,
    batInstCd: [],
    immediateStartYn: 'N',
  })

  async function init() {
    mode.value = 'new'

    Object.assign(inputData, {
      batId: null,
      batNm: null,
      batDesc: null,
      useYn: 'Y',
      schdlDvCd: null,
      schdlVal: null,
      dupExecAvlYn: 'N',
      dlyS: 0,
      batInstCd: [],
      immediateStartYn: 'N',
    })
  }

  async function updateForm(batch: Batch) {
    mode.value = 'update'

    const result = (
      await service.getBatch({
        header: {},
        batId: batch.batId,
      })
    ).body
    Object.assign(inputData, result)
    formDisabled.value = false

    const valueMap = result.insts.map(function (item) {
      return item.batInstCd
    })
    inputData.batInstCd = valueMap
  }

  function newForm() {
    formDisabled.value = false
    init()
  }

  const saveForm = useOnError(
    async () => {
      const realInputData = $ustra.utils.core.deepMerge({}, inputData)

      if (mode.value === 'new') {
        await service.addBatch({ header: {}, batch: realInputData })
      } else {
        await service.modBatch({ header: {}, batch: realInputData })
      }

      saved()
    },
    {
      // message: Error.message,
    },
  )

  async function deleteForm() {
    const realInputData = $ustra.utils.core.deepMerge({}, inputData)

    if (await confirm('삭제하시겠습니까?')) {
      await service.delBatch({ header: {}, batId: realInputData.batId })
      saved()
    }
  }

  async function saved() {
    formDisabled.value = true
    init()
    gridAction.loadData()
  }

  const histShow = ref(false)
  async function batchStart() {
    histShow.value = true
    await nextTick()
    const realInputData = $ustra.utils.core.deepMerge({}, formAction.inputData)
    batchHistComp.value.searchAction.loadSearchedData(realInputData.batId)
    const message = await service.startBatch({ header: {}, batId: realInputData.batId })
  }

  async function validateId(batId) {
    if (!batId) return
    if (mode.value === 'update') return
    try {
      const checkId = await service.getBatch({
        header: {},
        batId,
      })
      if (checkId) {
        return '이미 사용 중인 아이디입니다.'
      }
    } catch (error) {}
    return true
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
    batchStart,
    histShow,
  }
})()
</script>
<script lang="ts">
export default {
  name: 'UstraManagementSystemBatchTask',
}
</script>
<style scoped></style>
