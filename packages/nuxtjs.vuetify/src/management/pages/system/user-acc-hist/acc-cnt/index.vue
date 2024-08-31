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
        <VBtn text="초기화" class="gray ico_reset" prepend-icon="mdi-refresh" @click="searchAction.clearSearchParam" />
        <VBtn text="조회" class="primary ico_search" prepend-icon="mdi-magnify" @click="searchAction.loadSearchedData" />
        <VBtn text="엑셀다운로드" class="primary" prepend-icon="mdi-microsoft-excel" @click="gridAction.excelDownload" />
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
import { nextTick } from '#ustra/nuxt'
import UVCodeComboBox from '#ustra/nuxt-vuetify/management/components/combo-box/u-v-code-combo-box.vue'
import URealGrid from '#ustra/nuxt-vuetify/components/real-grid/u-real-grid.vue'
import { LocalDataProvider } from 'realgrid'
import UVDatePeriodBox from '#ustra/nuxt-vuetify/components/date-period/u-v-date-period-box.vue'
import { useLogger } from '#ustra/core'

const service = useUstraLoginHistoryService()
const sysCodeList = useUstraCodeList('SYS_CD')

const grid = ref(null)

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
    try {
      gridAction.data.value = (
        await service.getAccCnt({
          searchValue: {
            ...searchAction.searchParam,
          },
        })
      ).body
      console.log('gridAction.data.value', gridAction.data.value)
    } catch(e) {
      console.log(e)
    }
    gridAction.dataProvider.value.setRows(gridAction.data.value)
    await nextTick()
    // chartAction.chartList.value = gridAction.histGrid.collectionView
    // chartAction.chartList.value.sortDescriptions.push(new wjCore.SortDescription('accCnt', false))
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

    searchAction.searchParam.searchSrtDttm = new Date()
    searchAction.searchParam.searchEndDttm = new Date()
    // searchAction.searchParam.searchSrtDttm = v[0]
    // searchAction.searchParam.searchEndDttm = v[1]
  }
})

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
      name: 'accCnt',
      fieldName: 'accCnt',
      width: '80',
      header: {
        text: '사용시간',
      },
    },
    {
      name: 'lstLoginDttm',
      fieldName: 'lstLoginDttm',
      width: '80',
      header: {
        text: '최종 로그인 시간',
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
      fieldName: 'accCnt',
      dataType: 'text',
    },
    {
      fieldName: 'lstLoginDttm',
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

  function excelDownload() {
    grid.value.exportAsExcel({
      fileName: 'DownloadExcel.xlsx',
    })
  }

  return {
    data,
    // histGrid,
    excelDownload,
    columns,
    fields,
    ready,
    dataProvider,
  }
})()

const chartAction = (function () {
  const chart = ref(null)
  const chartList = ref<any>([])

  function exportChart(type) {
    chart.value.saveImageToFile('FlexChart.' + type)
  }

  function getLabelContent(hti) {
    let item = hti.item
    return ''
    // return wijmo.format('{name}({val}건)', { name: item.usrId, val: item.accCnt })
  }

  function tooltipContent(hti) {
    let item = hti.item
    return `<b>${item.usrNm}</b>(${item.accCnt}건)`
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
  name: 'UstraManagementSystemAccCnt',
}
</script>
<style scoped></style>
