<template>
  <UBox direction="row">
    <UItem :ratio="1">
      <URealGrid
        :columns="listActions.columns.value"
        :fields="listActions.fields.value"
        :dataProvider="listActions.dataProvider.value"
        :ready="listActions.ready.value"
        :onCellClick="formActions.loadDetail"
      />
    </UItem>

    <UItem :ratio="1">
      <UBox direction="col">
        <UItem :ratio="1">
          <UFieldSet>
            <UFieldRow>
              <UField required label="아이디">
                <VTextField
                  v-model="formActions.inputData.fileGrpId"
                  :isDisabled="!formActions.isNew.value"
                  :validation="{
                    rules: [
                      {
                        type: 'custom',
                        delay: 200,
                        handler: async v => {
                          if (!v) {
                            return '필수 입력입니다.'
                          }
                          if (await fileGroupService.getFileGroup(v)) {
                            return '이미 사용 중인 아이디입니다.'
                          }

                          return true
                        },
                      },
                    ],
                  }"
                />
              </UField>
            </UFieldRow>

            <UFieldRow>
              <UField required label="그룹명">
                <VTextField v-model="formActions.inputData.fileGrpNm" />
              </UField>
            </UFieldRow>

            <UFieldRow>
              <UField required label="저장경로">
                <VTextField v-model="formActions.inputData.svPath" />
              </UField>
            </UFieldRow>

            <UFieldRow>
              <UField required label="최대용량">
                <VTextField v-model="formActions.inputData.maxSz" />
              </UField>
            </UFieldRow>

            <UFieldRow>
              <UField label="확장자제한">
                <VTextField v-model="formActions.inputData.extenLmt" :isRequired="false" />
                <UMessage type="info">
                  미 입력시 모든 유형에 대해 업로드가 가능합니다.<br />
                  확장자 또는 Mime type별로 제한을 설정하는 경우, comma로 구분하여 입력해주세요. <br />
                  ex) .doc,.docx,application/msword,image/*
                </UMessage>
              </UField>
            </UFieldRow>

            <UFieldRow>
              <UField required label="파일구조">
                <UVCodeComboBox grpCd="DIR_STRUCT_CD" v-model="formActions.inputData.dirStructCd" />
              </UField>
            </UFieldRow>

            <UFieldRow>
              <UField required label="파일명 저장방식">
                <UVCodeComboBox grpCd="FILE_NM_SV_METH_CD" v-model="formActions.inputData.fileNmSvMethCd" />
              </UField>
            </UFieldRow>

            <UFieldRow>
              <UField label="웹 기본 url">
                <VTextField v-model="formActions.inputData.webDefUrl" :isRequired="false" />
              </UField>
            </UFieldRow>

            <UFieldRow>
              <UField required label="파일 암호화">
                <UVCodeComboBox grpCd="FILE_CRYT_METH_CD" v-model="formActions.inputData.fileCrytMethCd" />
              </UField>
            </UFieldRow>

            <UFieldRow>
              <UField required label="사용여부">
                <UVRadioGroupBox
                  v-model="formActions.inputData.useYn"
                  :itemsSource="[
                    { value: 'Y', text: '사용' },
                    { value: 'N', text: '미사용' },
                  ]"
                />
              </UField>
            </UFieldRow>
          </UFieldSet>
        </UItem>
        <UItem>
          <UButtonBox right top>
            <VBtn text="신규" type="primary" :width="80" @click="() => formActions.init(true)" />
            <VBtn text="저장" type="primary" :width="80" @click="() => formActions.save()" />
            <VBtn text="삭제" v-if="!formActions.isNew.value" :width="80" @click="() => formActions.remove()" />
          </UButtonBox>
        </UItem>
      </UBox>
    </UItem>
  </UBox>
</template>
<script lang="ts" setup>
import { shallowRef, ref, onBeforeMount, reactive, useDeepMerge, useOnError, watch, nextTick } from '#ustra/nuxt'

import UButton from '#ustra/nuxt-vuetify/components/button/u-button.vue'
import UMessage from '#ustra/nuxt-vuetify/components/message/u-message.vue'

import UVCodeComboBox from '#ustra/nuxt-vuetify/management/components/combo-box/u-v-code-combo-box.vue'
import UVRadioGroupBox from '#ustra/nuxt-vuetify/components/radio/u-v-radio-group-box.vue'

import { useUstraFileGroupService } from '#ustra/nuxt/management/composables'
import { FileGrp } from '#ustra/nuxt/management'
import { LocalDataProvider } from 'realgrid'
import URealGrid from '#ustra/nuxt-vuetify/components/real-grid/u-real-grid.vue'

const fileGroupService = useUstraFileGroupService()

/**
 * 그리드 목록 관련
 */
const listActions = (() => {
  const ready = ref(false)
  onMounted(() => {
    ready.value = true
  })

  const fields = ref([
    {
      fieldName: 'fileGrpId',
      dataType: 'text',
    },
    {
      fieldName: 'fileGrpNm',
      dataType: 'text',
    },
    {
      fieldName: 'useYn',
      dataType: 'text',
    },
  ])

  const columns = ref([
    {
      name: 'fileGrpId',
      fieldName: 'fileGrpId',
      width: '80',
      header: {
        text: '파일그룹ID',
      },
    },
    {
      name: 'fileGrpNm',
      fieldName: 'fileGrpNm',
      width: '80',
      header: {
        text: '파일그룹명',
      },
    },
    {
      name: 'useYn',
      fieldName: 'useYn',
      width: '80',
      header: {
        text: '사용여부',
      },
    },
  ])

  const dataProvider = ref(new LocalDataProvider(false))
  dataProvider.value.setRows([])

  /**
   * 파일 그룹 목록
   */
  const fileGroups = ref<Awaited<ReturnType<typeof fileGroupService.getFileGroups>>>([])

  /**
   * 그롭 목록 조회
   */
  async function load(fileGrpId: string = null) {
    fileGroups.value = await fileGroupService.getFileGroups()
    dataProvider.value.setRows(fileGroups.value)
    formActions.init()

    if (fileGrpId) {
      await nextTick()
      const index = fileGroups.value.findIndex(c => c.fileGrpId === fileGrpId)
    }
  }

  function clearSelection() {}

  onBeforeMount(() => load())

  return {
    fileGroups,
    load,
    clearSelection,
    columns,
    fields,
    dataProvider,
    ready,
  }
})()

/**
 * For 관련 action
 */
const formActions = (() => {
  // 입력 데이터
  const inputData: FileGrp = reactive({
    fileGrpId: null,
    fileGrpNm: null,
    svPath: null,
    useYn: 'Y',
    maxSz: 0,
    extenLmt: null,
    dirStructCd: 'RT_DIR',
    fileNmSvMethCd: '01',
    webDefUrl: null,
    fileCrytMethCd: '00',
  })

  // 신규 여부
  const isNew = ref(true)

  // const validationGroup = ref<InstanceType<typeof UValidationGroup>>()

  // 초기화
  async function init(clearSelection = false) {
    useDeepMerge(inputData, {
      fileGrpId: null,
      fileGrpNm: null,
      svPath: null,
      useYn: 'Y',
      maxSz: 0,
      extenLmt: null,
      dirStructCd: 'RT_DIR',
      fileNmSvMethCd: '01',
      webDefUrl: null,
      fileCrytMethCd: '00',
    })

    isNew.value = true
    //   await validationGroup.value.init()

    if (clearSelection) {
      listActions.clearSelection()
    }
  }

  async function loadDetail(grid, clickData) {
    await init()

    const itemIndex = clickData.itemIndex
    const data = listActions.dataProvider.value.getJsonRows()[itemIndex]
    console.log('data', data)

    const fileGrpData = await fileGroupService.getFileGroup(data.fileGrpId)
    useDeepMerge(inputData, fileGrpData)
    isNew.value = false

    //   await validationGroup.value.init()
  }

  // 저장
  async function save() {
    return await useOnError(async () => {
      // const result = await validationGroup.value.validate()
      // if (!result.isValid) {
      //   return
      // }

      if (isNew.value) {
        await fileGroupService.add(inputData)
      } else {
        await fileGroupService.edit(inputData)
      }

      listActions.load(inputData.fileGrpId)
    })()
  }

  // 삭제
  async function remove() {
    return await useOnError(async () => {
      if (await confirm('삭제하시겠습니까?')) {
        await fileGroupService.remove(inputData.fileGrpId)
        listActions.load()
      }
    })()
  }

  return {
    inputData,
    isNew,
    init,
    // validationGroup,
    save,
    loadDetail,
    remove,
  }
})()
</script>
<script lang="ts">
export default {
  name: 'UstraManagementSystemFileGroup',
}
</script>
