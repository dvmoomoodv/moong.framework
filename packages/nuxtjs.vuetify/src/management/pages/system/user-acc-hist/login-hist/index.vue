<template>
  <UBox direction="col">
    <UItem>
      <UFieldSet>
        <UFieldRow :ratio="[1, 1, 1, 1]">
          <UField required direction="col" label="시스템구분">
            <UVCodeComboBox grpCd="SYS_CD" v-model="searchAction.searchParam.sysCd" style="width: 250px" />
          </UField>
          <UField direction="col" label="기간">
            <UVDatePeriodBox v-model="searchPeriod" mode="date" value-format="yyyy-MM-dd" display-format="yyyy-MM-dd"></UVDatePeriodBox>
          </UField>
          <UField direction="col" label="사용자 아이디">
            <VTextField type="text" v-model="searchAction.searchParam.usrId" style="width: 250px" />
          </UField>
          <UField direction="col" label="사용자 명">
            <VTextField type="text" v-model="searchAction.searchParam.usrNm" style="width: 250px" />
          </UField>
        </UFieldRow>
      </UFieldSet>
      <UButtonBox :center="true">
        <VBtn text="초기화" class="gray ico_reset" @click="searchAction.clearSearchParam" />
        <VBtn text="조회" class="primary ico_search" @click="searchAction.loadSearchedData" />
        <VBtn text="엑셀다운로드" @click="gridAction.excelDownload" />
      </UButtonBox>
    </UItem>

    <UItem :ratio="1">
      <UBox direction="col">
        <URealGrid
          :columns="gridAction.columns.value"
          :fields="gridAction.fields.value"
          :dataProvider="gridAction.dataProvider.value"
          :ready="gridAction.ready.value"
          ref="grid"
        />
      </UBox>
    </UItem>
  </UBox>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, onMounted, useOnError, provide, inject, shallowRef, computed } from '#ustra/nuxt'
import { LoginHistCriteria, LoginHist } from '#ustra/nuxt/management/models/login-hist'
import { useUstraLoginHistoryService, useUstraCodeList } from '#ustra/nuxt/management'
import UVCodeComboBox from '#ustra/nuxt-vuetify/management/components/combo-box/u-v-code-combo-box.vue'
import URealGrid from '#ustra/nuxt-vuetify/components/real-grid/u-real-grid.vue'
import { LocalDataProvider } from 'realgrid'
import UVDatePeriodBox from '#ustra/nuxt-vuetify/components/date-period/u-v-date-period-box.vue'
import { useLogger } from '#ustra/core'

const service = useUstraLoginHistoryService()
// const wijmo = useWijmo()
const sysCodeList = useUstraCodeList('SYS_CD')

const searchAction = (function () {
  const searchParam: LoginHistCriteria = reactive({
    sysCd: sysCodeList.length > 0 ? sysCodeList[0].dtlCd : null,
    searchSrtDttm: $ustra.utils.formatting.date($ustra.utils.date.addDays(new Date(), -1), 'yyyyMMdd'),
    searchEndDttm: $ustra.utils.formatting.date(new Date(), 'yyyyMMdd'),
    usrId: null,
    usrNm: null,
    chartType: '10',
  })

  function clearSearchParam() {
    Object.assign(searchParam, {
      sysCd: sysCodeList.length > 0 ? sysCodeList[0].dtlCd : null,
      searchSrtDttm: $ustra.utils.formatting.date($ustra.utils.date.addDays(new Date(), -1), 'yyyyMMdd'),
      searchEndDttm: $ustra.utils.formatting.date(new Date(), 'yyyyMMdd'),
      usrId: null,
      usrNm: null,
      chartType: '10',
    })
  }

  async function loadSearchedData() {
    gridAction.data.value = (
      await service.getLoginHistorys({
        searchValue: {
          ...searchAction.searchParam,
        },
      })
    ).body

    gridAction.dataProvider.value.setRows(gridAction.data.value)

    chartAction.chartList.value = (await service.getListHhChart(searchAction.searchParam)).body
  }

  return {
    searchParam,
    clearSearchParam,
    loadSearchedData,
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

const grid = ref(null)

const gridAction = (function () {
  const columns = ref([
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
        text: '사용자명',
      },
    },
    {
      name: 'accIp',
      fieldName: 'accIp',
      width: '80',
      header: {
        text: '접근IP',
      },
    },
    {
      name: 'loginDttm',
      fieldName: 'loginDttm',
      width: '80',
      header: {
        text: '로그인 시간',
      },
    },
    {
      name: 'logotDttm',
      fieldName: 'logotDttm',
      width: '80',
      header: {
        text: '로그아웃 시간',
      },
    },
    {
      name: 'useTime',
      fieldName: 'useTime',
      width: '80',
      header: {
        text: '사용시간',
      },
    },
  ])

  const fields = ref([
    {
      fieldName: 'usrId',
      dataType: 'text',
    },
    {
      fieldName: 'usrNm',
      dataType: 'text',
    },
    {
      fieldName: 'accIp',
      dataType: 'text',
    },
    {
      fieldName: 'loginDttm',
      dataType: 'text',
    },
    {
      fieldName: 'logotDttm',
      dataType: 'text',
    },
    {
      fieldName: 'useTime',
      dataType: 'text',
    },
  ])
  const dataProvider = ref(new LocalDataProvider(false))

  const ready = ref(false)
  onMounted(() => {
    ready.value = true
  })

  const data = ref<LoginHist>([])

  // const histGrid = useWijmoFlexGrid({})

  function renderUsetime(data: LoginHist) {
    if (data.loginDttm && data.logotDttm) {
      const milliSec = $ustra.utils.date.getMilliDuration(new Date(data.loginDttm), new Date(data.logotDttm))
      return $ustra.utils.date.formatDuration(milliSec, 'milliSec')
    }
    return null
  }

  function excelDownload() {
    grid.value.exportAsExcel({
      fileName: 'DownloadExcel.xlsx',
    })
  }

  return {
    data,
    // histGrid,
    renderUsetime,
    excelDownload,
    columns,
    fields,
    dataProvider,
    ready,
  }
})()

const chartAction = (function () {
  const chart = ref(null)
  const chartList = ref<any>([])

  function exportChart(type) {
    chart.value.saveImageToFile('FlexChart.' + type)
  }

  function getLabelContent(ht) {
    // return wijmo.format('{name}시({val}건)', { name: ht.name, val: ht.value })
    return ''
  }

  function tooltipContent(hti) {
    let item = hti.item
    return `<b>${item.loginHour}시</b>(${item.loginCnt}건)`
  }

  return {
    chartList,
    chart,
    exportChart,
    getLabelContent,
    tooltipContent,
  }
})()
</script>
<script lang="ts">
export default {
  name: 'UstraManagementSystemLoginHist',
}
</script>
<style scoped></style>
