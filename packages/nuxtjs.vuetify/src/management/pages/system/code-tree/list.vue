<template>
  <UBox direction="col" :disabled="!props.parentCode">
    <UItem :ratio="1">
      <URealGrid
        :columns="columns"
        :fields="fields"
        :dataProvider="dataProvider"
        :ready="ready"
        :onCellDoubleClick="onGridDblClick"
      />
    </UItem>
    <UItem>
      <UButtonBar>
        <UButtonBox>
          <VBtn
            text="신규"
            :width="80"
            @click="
              () => {
                emits(
                  'clickNewButton',
                  props.depth,
                  Math.max(
                    Math.max(...codes.map((c) => c.srtNo), codes.length + 1)
                  )
                );
              }
            "
            type="primary"
          />
        </UButtonBox>
      </UButtonBar>
    </UItem>
  </UBox>
</template>
<script lang="ts" setup>
import {
  defineProps,
  withDefaults,
  watchEffect,
  watch,
  ref,
  defineExpose,
  nextTick,
  onMounted,
} from "#moong/nuxt";
import { UButtonBar } from "#moong/nuxt-vuetify/components";
import { Code, useUstraCodeService } from "#moong/nuxt/management";
import URealGrid from "#moong/nuxt-vuetify/components/real-grid/u-real-grid.vue";
import { LocalDataProvider } from "realgrid";

const codeService = useUstraCodeService();

const props = withDefaults(
  defineProps<{
    depth: number;
    parentCode?: Code;
  }>(),
  {
    parentCode: null,
  }
);

const emits = defineEmits<{
  (e: "clickNewButton", depth: number, sortNo: number): void;
  (e: "clickEditButton", depth: number, data: Code): void;
  (e: "selectionChanged", data: Code | null): void;
}>();

const ready = ref(false);
onMounted(() => {
  ready.value = true;
  console.log("=====>>>>> ready", ready.value);
});

const columns = ref([
  {
    name: "dtlCd",
    fieldName: "dtlCd",
    width: "80",
    header: {
      text: "코드",
    },
  },
  {
    name: "cdNm",
    fieldName: "cdNm",
    width: "80",
    header: {
      text: "코드명",
    },
  },
  {
    name: "useYn",
    fieldName: "useYn",
    width: "80",
    header: {
      text: "사용여부",
    },
  },
]);

const fields = ref([
  {
    fieldName: "grpCd",
    dataType: "text",
  },
  {
    fieldName: "dtlCd",
    dataType: "text",
  },
  {
    fieldName: "cdNm",
    dataType: "text",
  },
  {
    fieldName: "useYn",
    dataType: "text",
  },
]);

const dataProvider = ref(new LocalDataProvider(false));
dataProvider.value.setRows([]);

const GridAction = {
  columns,
  fields,
  dataProvider,
  ready,
};

const selectedRowData = ref();
watchEffect(() => {
  emits("selectionChanged", selectedRowData.value);
});

//#region load code
const codes = ref<Code[]>();
async function loadCodes(selectedCode = null) {
  selectedRowData.value = null;
  if (!props.parentCode) {
    codes.value = [];
    return;
  }

  if (props.depth === 1) {
    codes.value = await codeService.getCodesByGroup(props.parentCode.grpCd);
  } else {
    codes.value = await codeService.getCodeGroupDepth(
      props.parentCode.grpCd,
      props.parentCode.dtlCd
    );
  }
  console.log("codes.value", codes.value);
  dataProvider.value.setRows(codes.value);

  if (selectedCode) {
    await nextTick();
    const index = codes.value.findIndex((c) => c.dtlCd === selectedCode);
  }
}
//#endregion

//#region double click
function onGridDblClick(grid, clickData) {
  const itemIndex = clickData.itemIndex;
  const data = dataProvider.value.getJsonRows()[itemIndex];
  console.log("data", data);

  emits("clickEditButton", props.depth, data);
}
//#endregion

watch(
  () => props.parentCode,
  async () => {
    await nextTick();
    loadCodes();
  }
);

defineExpose({ loadCodes, selectedRowData });
</script>
<script lang="ts">
export default {
  name: "UstraSystemCodeList",
};
</script>
