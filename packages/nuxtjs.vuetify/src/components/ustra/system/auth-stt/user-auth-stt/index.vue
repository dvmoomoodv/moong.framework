<template>
    <UBox direction="col" height="100%">
        <UItem ratio="1">
            <UFieldSet>
                <UFieldRow :ratio="[1, 1]">
                    <UField direction="row" label="시스템 코드">
                        <UVCodeComboBox grpCd="SYS_CD" v-model="searchAction.searchParam.sysCd"></UVCodeComboBox>
                    </UField>
                    <UField direction="row" label="기간">
                      <UBaseDatepicker v-model="searchAction.searchParam.searchSrtDttm" />
                      ~
                      <UBaseDatepicker v-model="searchAction.searchParam.searchEndDttm" />
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
// import { AuthStt, AuthSttCriteria } from '#ustra/nuxt/management'
import URealGrid from '#ustra/nuxt-vuetify/components/real-grid/u-real-grid.vue'
import UVCodeComboBox from '#ustra/nuxt-vuetify/management/components/combo-box/u-v-code-combo-box.vue'
import UFieldSet from '@ustra/nuxt-vuetify/src/components/form/u-field-set.vue'
import { LocalDataProvider } from 'realgrid'
import UBaseDatepicker from '#ustra/nuxt-vuetify/components/datepicker/u-base-datepicker.vue'
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

const gridAction = (function () {
  const ready = ref(false)
  onMounted(() => {
    ready.value = true
  })
  const data = ref([])

  const dataProvider = ref(new LocalDataProvider(false))
  dataProvider.value.setRows([])

  async function load() {
   const result = await service.getAuthSttUserList({
     searchValue:{
       sysCd: searchAction.searchParam.sysCd.dtlCd? searchAction.searchParam.sysCd.dtlCd : searchAction.searchParam.sysCd,
       searchSrtDttm: searchAction.searchParam.searchSrtDttm,
       searchEndDttm: searchAction.searchParam.searchEndDttm
     }
   })

  let authList = $ustra.utils.core.deepMerge([], result.body)
  authList = authList
    .filter(v => v.scopeAuthMap)
    .map(v => {
      return { ...v, ...v.scopeAuthMap }
    })

  dataProvider.value.setRows(authList)
  }

  function excelDownload() {
    grid.value.exportAsExcel({
      fileName: '사용자별권한.xlsx',
    })
  }

  useOnError(async () => {
    await load()
    },
    { message: '데이터 조회 중 오류가 발생하였습니다.' },
  )()

  const fields = ref([
      {
        fieldName: 'usrNm',
        dataType: 'text',
      },
      {
        fieldName: 'usrId',
        dataType: 'text',
      },
      {
        fieldName: 'orgCd',
        dataType: 'text',
      },
      {
        fieldName: 'deptCd',
        dataType: 'text',
      },
      {
        fieldName: 'usrSttCd',
        dataType: 'text',
      },
      {
        fieldName: '01',
        dataType: 'text',
      },
      {
        fieldName: '02',
        dataType: 'text',
      },
      {
        fieldName: '99',
        dataType: 'text',
      },
      {
        fieldName: 'useSrtDt',
        dataType: 'text',
      },
      {
        fieldName: 'useEndDt',
        dataType: 'text',
      },
      {
        fieldName: 'lstLoginDttm',
        dataType: 'text',
      },
    ])

  const columns = ref([
      {
        name: 'usrNm',
        fieldName: 'usrNm',
        width: '80',
        header: {
          text: '사용자 명',
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
        name: 'orgCd',
        fieldName: 'orgCd',
        width: '80',
        header: {
          text: '회사 명',
        },
      },
      {
        name: 'deptCd',
        fieldName: 'deptCd',
        width: '80',
        header: {
          text: '부서 명',
        },
      },
      {
        name: 'usrSttCd',
        fieldName: 'usrSttCd',
        width: '80',
        header: {
          text: '사용자 상태',
        },
      },
      {
        name: 'usrSttCd',
        fieldName: 'usrSttCd',
        width: '80',
        header: {
          text: '사용자 상태',
        },
      },
      {
        name: '01',
        fieldName: '01',
        width: '80',
        header: {
          text: '권한',
        },
      },
      {
        name: '02',
        fieldName: '02',
        width: '80',
        header: {
          text: '기초 설정',
        },
      },
      {
        name: '99',
        fieldName: '99',
        width: '80',
        header: {
          text: '기타',
        },
      },
      {
        name: 'useSrtDt',
        fieldName: 'useSrtDt',
        width: '80',
        header: {
          text: '권한 시작일',
        },
      },
      {
        name: 'useEndDt',
        fieldName: 'useEndDt',
        width: '80',
        header: {
          text: '권한 만료일',
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