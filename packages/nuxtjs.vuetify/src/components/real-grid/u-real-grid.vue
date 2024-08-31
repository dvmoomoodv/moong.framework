<template>
  <div :id="container_uuid" ref="griddiv" class="realgrid_container"></div>
</template>
<script setup lang="ts">
import { watch, nextTick, ref, reactive } from "vue";
import { GridView, LocalDataProvider } from "realgrid";
import { ValueType } from "realgrid";
import { core } from "#moong/core/utils";
import { useUstraCodeValue } from "#moong/nuxt/management";
import {
  useRG,
  useRGSetSelectionType,
  useRGSetMultipleSelection,
  useRGSetFitStyle,
  useRGValueType,
} from "#moong/nuxt-vuetify/composables/realgrid";

interface RGColumnsType {
  fields: RGFields[];
  columns: RGColumns[];
}
interface RGFields {
  fieldName: string;
  dataType: ValueType;
}

interface RGColumns {
  name: string;
  fieldName: string;
  width: string | number;
  header: RGColumnsHeader;
}
interface RGColumnsHeader {
  text: string;
}

interface Props {
  columns?: any;
  fields?: any;
  dataProvider?: LocalDataProvider;
  fitStyle?: "none" | "even" | "evenFill" | "fill";
  ready?: boolean;
  onCellClick?: Function;
  onCellDoubleClick?: Function;
}

const props = withDefaults(defineProps<Props>(), {
  fitStyle: "evenFill",
});
// props.columns => ref

let gridView: GridView;
let dataProvider: LocalDataProvider;
let isComplete = false;
let _defaultOption = {
  selectionStyle: "rows",
  isMultiple: false,
};

/**
 * initRealGrid
 * @param fields
 * @param columns
 * @param rows
 */
const initRG = async (fields, columns, rows) => {
  await nextTick();
  const uuid = $ustra.utils.system.uuidBase62();
  const newDiv = document.createElement("div");
  newDiv.id = grid_uuid.value;
  newDiv.className = "realgrid";
  const container = document.getElementById(container_uuid.value);
  if (container) {
    container.appendChild(newDiv);
  }

  gridView = useRG(grid_uuid.value);

  gridView.registerCustomRenderer("ustra-common-code", {
    render: function (grid, model, w, h, info) {
      const span = this._dom;
      const grpCd = model.dataColumn.name;
      const cdNm = useUstraCodeValue(grpCd, model.value);
      span.textContent = cdNm;
    },
  });

  gridView.registerCustomRenderer("function", {
    render: function (grid, model, w, h, info) {
      const fn = model.dataColumn.renderer.fn;
      const span = this._dom;
      span.textContent = fn(model.value);
    },
  });

  props.dataProvider.setFields(
    fields.map((each) => {
      return {
        fieldName: each.fieldName,
        dataType: useRGValueType(each.dataType),
      };
    })
  );
  gridView.setDataSource(props.dataProvider);
  gridView.setColumns(columns);

  gridView.onCellClicked = props.onCellClick;

  gridView.onCellDblClicked = props.onCellDoubleClick;

  // gridView.onCell
  isComplete = true;

  return { gridView, dataProvider };
};

/**
 * container_uuid
 */
const container_uuid = computed(() => {
  return "grid-container" + $ustra.utils.system.uuidBase62();
});

/**
 * grid_uuid
 */
const grid_uuid = computed(() => {
  return "real-grid" + $ustra.utils.system.uuidBase62();
});

// const griddiv = ref(null)
// if(griddiv.value) {
//   console.log('=====>>>>> initRG')
//   initRG(props.fields, props.columns, [])
// }

// watch(() => griddiv.value, (a, b) => {
//   console.log('=====>>>>> initRG')
//   if(!a) {
//     return
//   }

//   if(gridView) {
//     return
//   }

//   initRG(props.fields, props.columns, [])
// })

console.log("=====>>>>> ready", props.ready);
if (props.ready) {
  console.log("=====>>>>> initRG");
  initRG(props.fields, props.columns, []);
}

watch(
  () => props.ready,
  (a, b) => {
    console.log("=====>>>>> watch : props.ready", props.ready);
    console.log("=====>>>>> watch : a", a);
    if (!a) {
      return;
    }

    initRG(props.fields, props.columns, []);
  }
);

watch(
  () => props,
  (current, previous) => {
    if (!isComplete) return;

    let _option = reactive(core.deepMerge({}, _defaultOption, current || {}));
    useRGSetSelectionType(gridView, _option);
    useRGSetMultipleSelection(gridView, _option);
    useRGSetFitStyle(gridView, _option);
  },
  { deep: true }
);

const exportAsExcel = ({
  fileName,
  showProgress = false,
  progressMessage = "파일을 다운로드합니다.",
  indicator = "default",
  header = "default",
  footer = "default",
  compatibility = true,
  done = () => {},
}) => {
  gridView.exportGrid({
    type: "excel",
    target: "local",
    fileName,
    showProgress,
    progressMessage,
    indicator,
    header,
    footer,
    compatibility,
    done,
  });
};

/**
 * initRealGrid : 그리드 초기화
 */
defineExpose({
  initRG,
  gridView: ref(gridView),
  dataProvider: ref(props.dataProvider),
  exportAsExcel: exportAsExcel,
});
</script>
<script lang="ts">
export default {
  name: "URealGrid",
};
</script>
