<template>
  <UBox direction="col" height="100%">
      <UItem ratio="1">
          <UFieldSet>
              <UFieldRow :ratio="[1, 1]">
                  <UField direction="row" label="기간">
                    <UVDatePeriodBox v-model="searchPeriod" mode="date" value-format="yyyy-MM-dd" display-format="yyyy-MM-dd"></UVDatePeriodBox>
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
          <URealGrid :columns="gridAction.columns.value"
                     :fields="gridAction.fields.value"
                     :ready="gridAction.ready.value"
                     :dataProvider="gridAction.dataProvider.value"
                     ref="grid"
        />
      </UItem>
  </UBox>
</template>
<script setup type="ts">
import { useUstraAuthSttService, useUstraCodeList } from '#ustra/nuxt/management'
import URealGrid from '#ustra/nuxt-vuetify/components/real-grid/u-real-grid.vue'
import UFieldSet from '#ustra/nuxt-vuetify/components/form/u-field-set.vue'
import { LocalDataProvider } from 'realgrid'
import UVDatePeriodBox from '#ustra/nuxt-vuetify/components/date-period/u-v-date-period-box.vue'
import { useLogger } from '#ustra/core'

const service = useUstraAuthSttService()
const sysCodeList = useUstraCodeList('SYS_CD')
const grid = ref(null)

const searchAction = (function () {
const searchParam = reactive({
    sysCd: "BO",
    searchSrtDttm: $ustra.utils.formatting.date($ustra.utils.date.addDays(new Date(), -1), 'yyyy-MM-dd'),
    searchEndDttm: $ustra.utils.formatting.date(new Date(), 'yyyy-MM-dd'),
})

async function loadSearchedData() {
  gridAction.load()
}

function clearSearchParam() {
  Object.assign(searchParam, {
    sysCd: "BO",
    searchSrtDttm: $ustra.utils.formatting.date($ustra.utils.date.addDays(new Date(), -1), 'yyyy-MM-dd'),
    searchEndDttm: $ustra.utils.formatting.date(new Date(), 'yyyy-MM-dd'),
  })
}

return {
  searchParam,
  loadSearchedData,
  clearSearchParam,
}
})()

const searchPeriod = computed({
  get: () => {
    return [searchAction.searchParam.searchSrtDttm, searchAction.searchParam.searchEndDttm]
  },
  set: (v) => {
    useLogger().debug('', v)
    if (!v) {
      searchAction.searchParam.searchSrtDttm = null
      searchAction.searchParam.searchEndDttm = null
    }

    searchAction.searchParam.searchSrtDttm = v[0]
    searchAction.searchParam.searchEndDttm = v[1]
  }
})

const gridAction = (function () {
const ready = ref(false)
onMounted(() => {
  ready.value = true
})
const data = ref([])

const dataProvider = ref(new LocalDataProvider(false))
dataProvider.value.setRows([])

async function load() {
const result = await service.getAuthSttGrpHistList({
  header: {
    currentPage: 1,
    pageSize: 20,
    orders: [],
  },
  searchValue:{
    searchSrtDttm: searchAction.searchParam.searchSrtDttm,
    searchEndDttm: searchAction.searchParam.searchEndDttm
  }
})
dataProvider.value.setRows(result.body)
}

function excelDownload() {
  grid.value.exportAsExcel({
    fileName: '권한그룹이력.xlsx',
  })
}

useOnError(async () => {
  await load()
  },
  { message: '데이터 조회 중 오류가 발생하였습니다.' },
)()

const fields = ref([
    {
      fieldName: 'inpDttm',
      dataType: 'text',
    },
    {
      fieldName: 'workDvCd',
      dataType: 'text',
    },
    {
      fieldName: 'authGrpId',
      dataType: 'text',
    },
    {
      fieldName: 'authGrpNm',
      dataType: 'text',
    },
    {
      fieldName: 'usrId',
      dataType: 'text',
    },
    {
      fieldName: 'usrNm',
      dataType: 'text',
    },
    {
      fieldName: 'updUsrId',
      dataType: 'text',
    },
    {
      fieldName: 'updUsrIp',
      dataType: 'text',
    },
  ])

const columns = ref([
    {
      name: 'inpDttm',
      fieldName: 'inpDttm',
      width: '80',
      header: {
        text: '변경 일시',
      },
    },
    {
      name: 'workDvCd',
      fieldName: 'workDvCd',
      width: '80',
      header: {
        text: '변경 구분',
      },
    },
    {
      name: 'authGrpId',
      fieldName: 'authGrpId',
      width: '80',
      header: {
        text: '그룹 아이디',
      },
    },
    {
      name: 'authGrpNm',
      fieldName: 'authGrpNm',
      width: '80',
      header: {
        text: '그룹 명',
      },
    },
    {
      name: 'usrId',
      fieldName: 'usrId',
      width: '80',
      header: {
        text: '사용자 아이디',
      },
    },
    {
      name: 'usrNm',
      fieldName: 'usrNm',
      width: '80',
      header: {
        text: '사용자 명',
      },
    },
    {
      name: 'updUsrId',
      fieldName: 'updUsrId',
      width: '80',
      header: {
        text: '수정자 아이디',
      },
    },
    {
      name: 'updUsrIp',
      fieldName: 'updUsrIp',
      width: '80',
      header: {
        text: '수정자 아이피',
      },
    },
  ])

return {
  data,
  load,
  excelDownload,
  // selectItem,
  dataProvider,
  columns,
  fields,
  ready,
}
})()
</script>