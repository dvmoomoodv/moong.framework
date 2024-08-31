<template>
  <v-row class="mb-10">
    <VCol cols="12" align="left">
      <span class="text-h5 font-weight-black">Ustra Nuxt Vuetify Samples</span>
    </VCol>
    <VCol cols="12">
      <span class="d-block text-caption"
        >- Vuetify 참고 링크 :
        <NuxtLink to="https://vuetifyjs.com/">Link</NuxtLink></span
      >
      <span class="d-block text-caption"
        >- Ckeditor 참고 링크 :
        <NuxtLink to="https://ckeditor.com/">Link</NuxtLink></span
      >
      <span class="d-block text-caption"
        >- Vue Treeview 참고 링크 :
        <NuxtLink to="https://n00ts.github.io/vue3-treeview/"
          >Link</NuxtLink
        ></span
      >
      <span class="d-block text-caption"
        >- Apexchart 참고 링크 :
        <NuxtLink to="https://apexcharts.com/">Link</NuxtLink></span
      >
      <span class="d-block text-caption"
        >- Maska 참고 링크 :
        <NuxtLink to="https://beholdr.github.io/maska/#/">Link</NuxtLink></span
      >
      <span class="d-block text-caption">
        - Draggable & Resizable 참고 링크 :
        <NuxtLink
          to="https://mauricius.github.io/vue-draggable-resizable/#/story/stories-basic-cancelhandle-story-vue?variantId=_default"
          >Link</NuxtLink
        ></span
      >
      <span class="d-block text-caption">
        - RealGrid 참고 링크 :
        <NuxtLink to="https://docs.realgrid.com/en">Link</NuxtLink></span
      >
    </VCol>
    <VCol cols="12" align="left">
      <span class="text-h8 font-weight-black">RealGrid SampleGrid </span><br />
      <span class="text-h8 font-weight-black"
        >리얼그리드 메뉴 작업전 샘플 메인페이지에서 작업합니다.</span
      ><br />
      - completed : {{ isCompleted }} <br />
      - isEditable : {{ isEditable }} <br />
      - Selection Type : {{ isSelectionType }} <br />
      - Paging : {{ isPaging }}<br />
    </VCol>
    <VCol cols="12">
      <VBtn @click="exportData()">export data</VBtn>
    </VCol>
    <VCol cols="12">
      <!-- <div id="grid-container"></div>
      <v-pagination v-model="page" :length="Math.round(13 / 3)"></v-pagination>
      <URealGrid ref="grid1" />
      <URealGrid ref="grid2" />
      <URealGrid ref="grid3" /> -->
    </VCol>
    <VCol cols="12" align="left">
      <span class="d-block">- Selected Data</span>
      - Active Data : {{ activeData }} <br /><br />
      - Active Info : {{ activeInfo }} <br /><br />
      - Active Name : {{ activeData?.Name }}
    </VCol>
    <VCol cols="12" align="left">
      <span class="d-block">- selection Type </span>
      <VBtn @click="changeSelectionType('block')">selectionType block</VBtn>
      <VBtn @click="changeSelectionType('rows')">selectionType rows</VBtn>
      <VBtn @click="changeSelectionType('columns')">selectionType column</VBtn>
      <VBtn @click="changeSelectionType('singleRow')"
        >selectionType single row</VBtn
      >
      <VBtn @click="changeSelectionType('singleColumn')"
        >selectionType single column</VBtn
      >
      <VBtn @click="changeSelectionType('none')">selectionType none</VBtn>
    </VCol>
    <VCol cols="12" align="left">
      <span class="d-block">- paging </span>
      <VBtn @click="changePaging(false)">paging false</VBtn>
      <VBtn @click="changePaging(true)">paging true</VBtn>
    </VCol>
    <VCol cols="12" align="left">
      <span class="d-block">- editable </span>
      <VBtn @click="changeEditable(false)">Editable false</VBtn>
      <VBtn @click="changeEditable(true)">Editable true</VBtn>
    </VCol>
  </v-row>
  <!-- <UMarkdownViewer :content="diff" /> -->
</template>
<script lang="ts" setup>
import { UMarkdownViewer } from "#moong/nuxt/components";
import diff from "./diff.md";
import URealGrid from "#moong/nuxt-vuetify/components/real-grid/u-real-grid.vue";
import {
  columns,
  fields,
  rows,
} from "@/pages/vuetify/samples/_data/realgrid-data.ts";
const gridView = ref(null);
const dataProvider = ref(null);
const isCompleted = ref(false);
const isEditable = ref(false);
const isSelectionType = ref("rows");
const activeInfo = ref(null); // Cell active info
const activeData = ref(null); // Cell active data
const page = ref(1);
const isPaging = ref(false);

const grid1 = ref(null);
const grid2 = ref(null);
const grid3 = ref(null);

onMounted(async () => {
  const { gridView1, dataProvider1 } = grid1.value.initRG(
    fields,
    columns,
    rows,
    {}
  );

  const { gridView2, dataProvider2 } = grid2.value.initRG(
    fields,
    columns,
    rows,
    {}
  );

  const { gridView3, dataProvider3 } = grid3.value.initRG(
    fields,
    columns,
    rows,
    {}
  );

  const newDiv = document.createElement("div");
  newDiv.id = "realgrid";
  newDiv.className = "realgrid";
  const container = document.getElementById("grid-container"); // container div 찾기
  if (container) {
    container.appendChild(newDiv); // container 내부에 새 div 추가
  }

  await nextTick();
  gridView.value = useRG("realgrid");
  dataProvider.value = useRGLocalDataProvider(false);
  useRGSetSelectionType(gridView.value, "rows");
  gridView.value.setDataSource(dataProvider.value);
  dataProvider.value.setFields(fields);
  gridView.value.setColumns(columns);
  dataProvider.value.setRows(rows);

  /**
   * Paging Start
   */
  // gridView.value.setPaging(true, 3)
  // gridView.value.setPage(4)
  /**
   * Paging end
   */

  /**
   * 첫행 선택 start
   * @param grid
   */
  gridView.value.onDataLoadComplated = (grid) => {
    const index = gridView.value.searchCell({
      startIndex: 0,
    });
    gridView.value.setCurrent(index);
    gridView.value.setFocus();

    isCompleted.value = true;
  };
  /**
   * 첫행 선택 end
   */

  /**
   * Grid Click start
   */
  gridView.value.onCellClicked = (grid, clickData) => {
    console.log("grid onCellClicked");
    activeInfo.value = clickData;
    if (clickData?.itemIndex) {
      activeData.value = dataProvider.value.getJsonRow(clickData.dataRow);
    }
  };
  /**
   * Grid Click end
   */
});

/**
 * RealGrid Sample function
 */
const changeSelectionType = (
  selectionType:
    | "block"
    | "rows"
    | "columns"
    | "singleRow"
    | "singleColumn"
    | "none"
) => {
  console.log("selectedType = ", selectionType);
  isSelectionType.value = selectionType;
  useRGSetSelectionType(gridView.value, selectionType);
};

/**
 * changeEditable
 * @param editable
 */
const changeEditable = (editable: boolean) => {
  console.log("isEditable = ", editable);
  isEditable.value = editable;
  gridView.value.setEditOptions({ editable: editable });
};

/**
 * Paging start
 * @param paging
 */
const changePaging = (paging: boolean) => {
  isPaging.value = paging;
  gridView.value.setPaging(paging, 3);
};
watch(page, (v) => {
  gridView.value.setPage(v);
});
/**
 * Paging end
 */

/**
 * Export Data Start
 */
const exportData = () => {
  gridView.value.exportGrid({
    type: "excel",
    target: "local",
    fileName: "gridExportSample.xlsx",
    showProgress: true,
    progressMessage: "Exporting to Excel.",
    indicator: "default",
    header: "default",
    footer: "default",
    compatibility: "MS Excel",
    done: function () {
      //Function to be executed after export is complete
      alert("done excel export");
    },
  });
};
/**
 * Export Data end
 */

definePageMeta({
  layout: "samples",
});
</script>
