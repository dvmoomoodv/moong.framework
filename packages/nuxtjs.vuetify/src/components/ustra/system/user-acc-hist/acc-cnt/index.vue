<template>
  <UBox direction="col">
    <UItem>
      <UFieldSet>
        <UFieldRow :ratio="[1, 1, 1, 1, 1]">
          <UField required direction="col" label="시스템구분">
            <UVCodeComboBox
              grpCd="SYS_CD"
              v-model="searchAction.searchParam.sysCd"
              style="width: 250px"
            />
          </UField>
          <UField direction="col" label="기간">
            <!-- <UVDatePeriodBox
              :width="300"
              v-model:start="searchAction.searchParam.searchSrtDttm"
              v-model:end="searchAction.searchParam.searchEndDttm"
              mode="date"
              displayFormat="yyyy-MM-dd"
              valueFormat="yyyyMMdd"
            /> -->

            <UBaseDatepicker v-model="searchAction.searchParam.searchSrtDttm" />

            <UBaseDatepicker v-model="searchAction.searchParam.searchEndDttm" />
          </UField>
          <UField direction="col" label="차트종류">
            <UVCodeComboBox
              grpCd="CHRT_KIND_CD"
              v-model="searchAction.searchParam.chartType"
              style="width: 250px"
            />
          </UField>
          <UField direction="col" label="사용자 아이디">
            <VTextField
              type="text"
              v-model="searchAction.searchParam.usrId"
              style="width: 250px"
            />
          </UField>
          <UField direction="col" label="사용자 명">
            <VTextField
              type="text"
              v-model="searchAction.searchParam.usrNm"
              style="width: 250px"
            />
          </UField>
        </UFieldRow>
      </UFieldSet>
      <UButtonBox :center="true">
        <VBtn
          text="초기화"
          class="gray ico_reset"
          prepend-icon="mdi-refresh"
          @click="searchAction.clearSearchParam"
        />
        <VBtn
          text="조회"
          class="primary ico_search"
          prepend-icon="mdi-magnify"
          @click="searchAction.loadSearchedData"
        />
        <VBtn
          text="엑셀다운로드"
          class="primary"
          prepend-icon="mdi-microsoft-excel"
          @click="gridAction.excelDownload"
        />
      </UButtonBox>
    </UItem>

    <UItem>
      <UButtonBox :right="true">
        <VBtn
          text="PNG"
          class="btn btn-default"
          prepend-icon="mdi-file-png-box"
          v-on:click="chartAction.exportChart('png')"
        />
        <VBtn
          text="JPEG"
          class="btn btn-default"
          prepend-icon="mdi-file-jpg-box"
          v-on:click="chartAction.exportChart('jpeg')"
        />
        <VBtn
          text="SVG"
          class="btn btn-default"
          prepend-icon="mdi-svg"
          v-on:click="chartAction.exportChart('svg')"
        />
      </UButtonBox>

      <WjFlexChart
        v-if="searchAction.searchParam.chartType === '10'"
        :initialized="(flex) => (chartAction.chart.value = flex)"
        header="접속 횟수"
        bindingX="usrId"
        selectionMode="Point"
        :itemsSource="chartAction.chartList.value"
        :tooltipContent="chartAction.tooltipContent"
      >
        <WjFlexChartLegend position="Right" />
        <WjFlexChartSeries name="건수" binding="accCnt" />
        <WjFlexChartAnimation />
      </WjFlexChart>
      <WjFlexChart
        v-if="searchAction.searchParam.chartType === '20'"
        :initialized="(flex) => (chartAction.chart.value = flex)"
        header="접속 횟수"
        chartType="Bar"
        bindingX="usrId"
        stacking="Stacked"
        :itemsSource="chartAction.chartList.value"
        :tooltipContent="chartAction.tooltipContent"
      >
        <WjFlexChartLegend position="Right" />
        <WjFlexChartSeries name="건수" binding="accCnt" />
        <WjFlexChartAxis wjProperty="axisY" :reversed="false" />
        <WjFlexChartAnimation />
      </WjFlexChart>
      <WjFlexPie
        v-if="searchAction.searchParam.chartType === '30'"
        :initialized="(flex) => (chartAction.chart.value = flex)"
        header="접속 횟수"
        bindingName="usrId"
        binding="accCnt"
        :itemsSource="chartAction.chartList.value"
      >
        <WjFlexPieDataLabel :content="chartAction.getLabelContent" />
        <WjFlexChartLegend position="Right" />
      </WjFlexPie>
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
        <WjFlexGrid style="height: 300px" :itemsSource="gridAction.data.value">
          <WjFlexGridColumn binding="usrId" header="사용자 아이디" width="*" />
          <WjFlexGridColumn binding="usrNm" header="사용자 명" width="*" />
          <WjFlexGridColumn binding="accIp" header="접근 아이피" width="*" />
          <WjFlexGridColumn binding="accCnt" header="횟수" width="*" />
          <WjFlexGridColumn
            binding="useSec"
            header="사용시간"
            width="*"
            :cellTemplate="
              (ctx) =>
                ctx.value
                  ? $ustra.utils.date.formatDuration(ctx.value, 'sec')
                  : ctx.value
            "
          />
          <WjFlexGridColumn
            binding="lstLoginDttm"
            header="최종 로그인 시간"
            width="*"
            :cellTemplate="
              (ctx) =>
                ctx.value
                  ? $ustra.utils.formatting.datetime(ctx.value)
                  : ctx.value
            "
          />
        </WjFlexGrid>
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
  LoginHistCriteria,
  LoginHist,
} from "#moong/nuxt/management/models/login-hist";
import {
  useUstraLoginHistoryService,
  useUstraCodeList,
} from "#moong/nuxt/management";
import { nextTick } from "#moong/nuxt";
import UVCodeComboBox from "#moong/nuxt-vuetify/management/components/combo-box/u-v-code-combo-box.vue";
import URealGrid from "#moong/nuxt-vuetify/components/real-grid/u-real-grid.vue";
import { LocalDataProvider } from "realgrid";
import UBaseDatepicker from "#moong/nuxt-vuetify/components/datepicker/u-base-datepicker.vue";

const service = useUstraLoginHistoryService();
const sysCodeList = useUstraCodeList("SYS_CD");

const grid = ref(null);

const searchAction = (function () {
  const searchParam: LoginHistCriteria = reactive({
    sysCd: sysCodeList.length > 0 ? sysCodeList[0].dtlCd : null,
    searchSrtDttm: $ustra.utils.formatting.date(
      $ustra.utils.date.addDays(new Date(), -1),
      "yyyyMMdd"
    ),
    searchEndDttm: $ustra.utils.formatting.date(new Date(), "yyyyMMdd"),
    usrId: null,
    usrNm: null,
    chartType: "10",
  });

  function clearSearchParam() {
    Object.assign(searchParam, {
      sysCd: sysCodeList.length > 0 ? sysCodeList[0].dtlCd : null,
      searchSrtDttm: $ustra.utils.formatting.date(
        $ustra.utils.date.addDays(new Date(), -1),
        "yyyyMMdd"
      ),
      searchEndDttm: $ustra.utils.formatting.date(new Date(), "yyyyMMdd"),
      usrId: null,
      usrNm: null,
      chartType: "10",
    });
  }

  async function loadSearchedData() {
    gridAction.data.value = (
      await service.getAccCnt({
        searchValue: {
          ...searchAction.searchParam,
        },
      })
    ).body;

    gridAction.dataProvider.value.setRows(gridAction.data.value);
    await nextTick();
    chartAction.chartList.value = gridAction.histGrid.collectionView;
    chartAction.chartList.value.sortDescriptions.push(
      new wjCore.SortDescription("accCnt", false)
    );
  }

  return {
    searchParam,
    clearSearchParam,
    loadSearchedData,
  };
})();

const gridAction = (function () {
  const columns = ref([
    {
      name: "usrId",
      fieldName: "usrId",
      width: "80",
      header: {
        text: "사용자 아이디",
      },
    },
    {
      name: "usrNm",
      fieldName: "usrNm",
      width: "80",
      header: {
        text: "사용자명",
      },
    },
    {
      name: "accIp",
      fieldName: "accIp",
      width: "80",
      header: {
        text: "접근IP",
      },
    },
    {
      name: "accCnt",
      fieldName: "accCnt",
      width: "80",
      header: {
        text: "사용시간",
      },
    },
    {
      name: "lstLoginDttm",
      fieldName: "lstLoginDttm",
      width: "80",
      header: {
        text: "최종 로그인 시간",
      },
    },
  ]);

  const fields = ref([
    {
      fieldName: "usrId",
      dataType: "text",
    },
    {
      fieldName: "usrNm",
      dataType: "text",
    },
    {
      fieldName: "accIp",
      dataType: "text",
    },
    {
      fieldName: "accCnt",
      dataType: "text",
    },
    {
      fieldName: "lstLoginDttm",
      dataType: "text",
    },
  ]);
  const dataProvider = ref(new LocalDataProvider(false));

  const ready = ref(false);
  onMounted(() => {
    ready.value = true;
  });

  const data = ref<LoginHist>([]);

  // const histGrid = useWijmoFlexGrid({})

  function excelDownload() {
    grid.value.exportAsExcel({
      fileName: "DownloadExcel.xlsx",
    });
  }

  return {
    data,
    // histGrid,
    excelDownload,
    columns,
    fields,
    ready,
    dataProvider,
  };
})();

const chartAction = (function () {
  const chart = ref(null);
  const chartList = ref<any>([]);

  function exportChart(type) {
    chart.value.saveImageToFile("FlexChart." + type);
  }

  function getLabelContent(hti) {
    let item = hti.item;
    return "";
    // return wijmo.format('{name}({val}건)', { name: item.usrId, val: item.accCnt })
  }

  function tooltipContent(hti) {
    let item = hti.item;
    return `<b>${item.usrNm}</b>(${item.accCnt}건)`;
  }

  return {
    chartList,
    chart,
    exportChart,
    getLabelContent,
    tooltipContent,
  };
})();
</script>
<script lang="ts">
export default {
  name: "UstraManagementSystemAccCnt",
};
</script>
<style scoped></style>
