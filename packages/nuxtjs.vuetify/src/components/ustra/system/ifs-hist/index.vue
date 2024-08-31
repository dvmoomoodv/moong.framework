<template>
  <UBox direction="col">
    <UItem>
      <UFieldSet>
        <UFieldRow :ratio="[1, 1, 1, 1]">
          <UField direction="row" label="프로세스 아이디">
            <VTextField type="text" v-model="searchAction.searchParam.procId" style="width: 230px" />
          </UField>
          <UField direction="row" label="요청 아이디">
            <VTextField type="text" v-model="searchAction.searchParam.reqId" style="width: 230px" />
          </UField>
          <UField direction="row" label="인터페이스 아이디">
            <VTextField type="text" v-model="searchAction.searchParam.ifId" style="width: 230px" />
          </UField>
          <UField direction="row" label="URL">
            <VTextField type="text" v-model="searchAction.searchParam.url" style="width: 230px" />
          </UField>
        </UFieldRow>
        <UFieldRow :ratio="[1, 1, 1, 1]">
          <UField direction="row" label="채널 코드">
            <UVCodeComboBox grpCd="CHNL_CD" v-model="searchAction.searchParam.chnlCd" style="width: 230px" :displayNullText="'전체'" />
          </UField>
          <UField direction="row" label="성공 여부">
            <VCombobox
              v-model="searchAction.searchParam.succYn"
              style="width: 230px"
              :items="searchAction.succYnItems"
              displayMemberPath="text"
              selectedValuePath="value"
            />
          </UField>
          <UField direction="row" label="응답 코드 값">
            <VTextField type="text" v-model="searchAction.searchParam.resCdVal" style="width: 230px" />
          </UField>
        </UFieldRow>
        <UFieldRow>
          <UField direction="row" label="기간">
            <UVDatePeriodBox
              :width="500"
              v-model:start="searchAction.searchParam.searchSrtDttm"
              v-model:end="searchAction.searchParam.searchEndDttm"
              mode="datetime"
              displayFormat="yyyy-MM-dd HH:mm"
              valueFormat="yyyyMMddHHmm"
            />
          </UField>
        </UFieldRow>
      </UFieldSet>
      <UButtonBox :center="true">
        <VBtn text="초기화" class="gray ico_reset" @click="searchAction.clearSearchParam" />
        <VBtn text="조회" class="primary" @click="searchAction.loadSearchedData" />
        <VBtn text="엑셀다운로드" class="primary" type="default" @click="gridAction.excelDownload" />
      </UButtonBox>
    </UItem>

    <UItem :ratio="1">
      <UBox direction="row" style="gap: 5px">
        <UItem :ratio="6">
          <URealGrid
            :columns="gridAction.columns.value"
            :fields="gridAction.fields.value"
            :dataProvider="gridAction.dataProvider.value"
            :ready="gridAction.ready.value"
            :onCellClick="gridAction.selectItem"
          />
        </UItem>
        <UItem :ratio="3" v-if="formAction.isFormVisible.value">
          <UFieldSet>
            <UFieldRow>
              <UField label="요청 헤더 내용"><VTextField type="textarea" rows="2" noResize v-model="formAction.inputData.reqHedCont" /> </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="요청 파라메터 내용"><VTextField type="textarea" rows="2" noResize v-model="formAction.inputData.reqPrmCont" /> </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="요청 메시지"><VTextField type="textarea" rows="2" noResize v-model="formAction.inputData.reqMsgCont" /> </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="응답 헤더 내용"><VTextField type="textarea" rows="2" noResize v-model="formAction.inputData.resHedCont" /> </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="응답 메시지"><VTextField type="textarea" rows="2" noResize v-model="formAction.inputData.resMsgCont" /> </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="비고"><VTextField type="textarea" rows="2" noResize v-model="formAction.inputData.rmk" /> </UField>
            </UFieldRow>
            <UFieldRow>
              <VBtn text="확인" @click="formAction.close" />
            </UFieldRow>
          </UFieldSet>
        </UItem>
      </UBox>
    </UItem>
  </UBox>
</template>
<script lang="ts" setup>
import { ref, reactive, useOnError } from '#ustra/nuxt'
import { IfsCriteria, IfsHist } from '#ustra/nuxt/management/models/interfaces'
import { useUstraInterfaceService } from '#ustra/nuxt/management'
import UButton from '#ustra/nuxt-vuetify/components/button/u-button.vue'
import UMessage from '#ustra/nuxt-vuetify/components/message/u-message.vue'

import UVCodeComboBox from '#ustra/nuxt-vuetify/management/components/combo-box/u-v-code-combo-box.vue'
import UVRadioGroupBox from '#ustra/nuxt-vuetify/components/radio/u-v-radio-group-box.vue'
import URealGrid from '#ustra/nuxt-vuetify/components/real-grid/u-real-grid.vue'
import { LocalDataProvider } from 'realgrid'
const service = useUstraInterfaceService()
const searchAction = (function () {
  const searchParam: IfsCriteria = reactive({
    procId: null,
    reqId: null,
    ifId: null,
    sysCd: null,
    chnlCd: null,
    url: null,
    succYn: null,
    resCdVal: null,
    searchSrtDttm: $ustra.utils.formatting.date($ustra.utils.date.addDays(new Date(), -7), 'yyyyMMddHHmm'),
    searchEndDttm: $ustra.utils.formatting.date(new Date(), 'yyyyMMddHHmm'),
  })

  function clearSearchParam() {
    Object.assign(searchParam, {
      procId: null,
      reqId: null,
      ifId: null,
      sysCd: null,
      chnlCd: null,
      url: null,
      succYn: null,
      resCdVal: null,
      searchSrtDttm: $ustra.utils.formatting.date($ustra.utils.date.addDays(new Date(), -1), 'yyyyMMddHHmm'),
      searchEndDttm: $ustra.utils.formatting.date(new Date(), 'yyyyMMddHHmm'),
    })
  }

  async function loadSearchedData() {
    formAction.isFormVisible.value = false
    gridAction.load()
  }

  const succYnItems = reactive([
    { value: null, text: '전체' },
    { value: 'Y', text: '성공' },
    { value: 'N', text: '실패' },
  ])

  return {
    searchParam,
    clearSearchParam,
    loadSearchedData,
    succYnItems,
  }
})()

const gridAction = (function () {
  const ready = ref(false)
  onMounted(() => {
    ready.value = true
  })

  const fields = ref([
    {
      fieldName: 'ifHistId',
      dataType: 'text',
    },
    {
      fieldName: 'procId',
      dataType: 'text',
    },
    {
      fieldName: 'reqId',
      dataType: 'text',
    },
    {
      fieldName: 'reqNo',
      dataType: 'text',
    },
    {
      fieldName: 'ifId',
      dataType: 'text',
    },
    {
      fieldName: 'ifVer',
      dataType: 'text',
    },
    {
      fieldName: 'ifNm',
      dataType: 'text',
    },
    {
      fieldName: 'sysCd',
      dataType: 'text',
    },
    {
      fieldName: 'chnlCd',
      dataType: 'text',
    },
    {
      fieldName: 'url',
      dataType: 'text',
    },
    {
      fieldName: 'httpMethCd',
      dataType: 'text',
    },
    {
      fieldName: 'succYn',
      dataType: 'text',
    },
    {
      fieldName: 'resCdVal',
      dataType: 'text',
    },
    {
      fieldName: 'httpSttCdVal',
      dataType: 'text',
    },
    {
      fieldName: 'usrId',
      dataType: 'text',
    },
    {
      fieldName: 'usrKey',
      dataType: 'text',
    },
    {
      fieldName: 'reqDttm',
      dataType: 'text',
    },
  ])

  const columns = ref([
    {
      name: 'procId',
      fieldName: 'procId',
      width: '80',
      header: {
        text: '프로세스 아이디',
      },
    },
    {
      name: 'reqId',
      fieldName: 'reqId',
      width: '80',
      header: {
        text: '요청 아이디',
      },
    },
    {
      name: 'reqNo',
      fieldName: 'reqNo',
      width: '80',
      header: {
        text: '요청 번호',
      },
    },
    {
      name: 'ifId',
      fieldName: 'ifId',
      width: '80',
      header: {
        text: 'I/F 아이디',
      },
    },
    {
      name: 'ifVer',
      fieldName: 'ifVer',
      width: '80',
      header: {
        text: 'I/F 버전',
      },
    },
    {
      name: 'ifNm',
      fieldName: 'ifNm',
      width: '80',
      header: {
        text: 'I/F 명',
      },
    },
    {
      name: 'sysCd',
      fieldName: 'sysCd',
      width: '80',
      header: {
        text: '시스템 코드',
      },
    },
    {
      name: 'chnlCd',
      fieldName: 'chnlCd',
      width: '80',
      header: {
        text: '채널 코드',
      },
    },
    {
      name: 'url',
      fieldName: 'url',
      width: '80',
      header: {
        text: 'URL',
      },
    },
    {
      name: 'httpMethCd',
      fieldName: 'httpMethCd',
      width: '80',
      header: {
        text: 'HTTP 메소드',
      },
    },
    {
      name: 'succYn',
      fieldName: 'succYn',
      width: '80',
      header: {
        text: '성공 여부',
      },
    },
    {
      name: 'resCdVal',
      fieldName: 'resCdVal',
      width: '80',
      header: {
        text: '응답코드값',
      },
    },
    {
      name: 'httpSttCdVal',
      fieldName: 'httpSttCdVal',
      width: '80',
      header: {
        text: 'HTTP상태코드값',
      },
    },
    {
      name: 'usrId',
      fieldName: 'usrId',
      width: '80',
      header: {
        text: '사용자아이디',
      },
    },
    {
      name: 'usrKey',
      fieldName: 'usrKey',
      width: '80',
      header: {
        text: '사용자키',
      },
    },
    {
      name: 'reqDttm',
      fieldName: 'reqDttm',
      width: '80',
      header: {
        text: '처리일시',
      },
    },
  ])
  const data = ref([])

  const dataProvider = ref(new LocalDataProvider(false))
  dataProvider.value.setRows([])

  async function load() {
    const saveData: IfsCriteria = reactive({})
    Object.assign(saveData, searchAction.searchParam)
    saveData.searchSrtDttm = searchAction.searchParam.searchSrtDttm
      ? searchAction.searchParam.searchSrtDttm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5')
      : null
    saveData.searchEndDttm = searchAction.searchParam.searchEndDttm
      ? searchAction.searchParam.searchEndDttm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5')
      : null

    const result = await service.getIntefaceHistories({
      searchValue: {
        ...saveData,
      },
    })

    dataProvider.value.setRows(result.body)
  }

  useOnError(
    async () => {
      await load()
    },
    { message: '데이터 조회 중 오류가 발생하였습니다.' },
  )()

  function excelDownload() {
    const saveData: IfsCriteria = reactive({})
    Object.assign(saveData, searchAction.searchParam)
    saveData.searchSrtDttm = searchAction.searchParam.searchSrtDttm
      ? searchAction.searchParam.searchSrtDttm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5')
      : null
    saveData.searchEndDttm = searchAction.searchParam.searchEndDttm
      ? searchAction.searchParam.searchEndDttm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5')
      : null

    if (data.length < 1) {
      alert('엑셀 다운로드할 데이터가 없습니다.')
      return
    } else {
      const url = $ustra.api
        .urlBuilder('/api/system/ifshist/download/excel')
        .addBase64('paginationRequest', {
          currentPage: 0,
          pageSize: 0,
          orders: null,
        })
        .addBase64('criteria', { searchValue: saveData })
        .build()
      $ustra.api.downloadFile({
        fileName: '인터페이스이력.xlsx',
        url,
        method: 'GET',
      })
    }
  }

  async function selectItem(grid, clickData) {
    const itemIndex = clickData.itemIndex
    const data = dataProvider.value.getJsonRows()[itemIndex]
    const result: IfsHist = await service.getInterfaceHistory(data.ifHistId)
    Object.assign(formAction.inputData, result)
    formAction.isFormVisible.value = true
  }

  return {
    data,
    load,
    excelDownload,
    selectItem,
    dataProvider,
    columns,
    fields,
    ready,
  }
})()

const formAction = (function () {
  const inputData = reactive({
    reqHedCont: null,
    reqPrmCont: null,
    reqMsgCont: null,
    resHedCont: null,
    resMsgCont: null,
    rmk: null,
  })

  const isFormVisible = ref(false)
  function close() {
    isFormVisible.value = false
  }
  return { inputData, isFormVisible, close }
})()
</script>
<script lang="ts">
export default {
  name: 'UstraManagementSystemIfsHist',
}
</script>
<style scoped></style>
