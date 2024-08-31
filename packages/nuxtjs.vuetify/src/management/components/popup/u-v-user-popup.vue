<template>
  <UPopup
    v-model="value"
    title="코드 조회"
    :width="props.width"
    :height="props.height"
  >
    <UBox direction="col">
      <UItem>
        <UButtonBar>
          <UFieldSet>
            <UFieldRow :ratio="[2, 1]">
              <UField label="코드/명" direction="col">
                <VTextField
                  ref="keywordInput"
                  v-model="inputValue.keyword"
                  :initialized="(e) => e.focus()"
                  @keyup.enter="search"
                />
              </UField>
              <UField blank>
                <UButtonBox>
                  <VBtn @click="search">검색</VBtn>
                </UButtonBox>
              </UField>
            </UFieldRow>
          </UFieldSet>
        </UButtonBar>
      </UItem>

      <UItem :ratio="1" scrollType="hidden">
        <!-- <WjFlexGrid
          style="height: 100%"
          :itemsSource="itemsSource"
          :initialized="
            e => {
              grid = e
              addWjGridEventHandler(grid, onGridRowDblClick)
            }
          "
          :selectionChanged="e => (disabledButton = e.selectedRows.length < 1)"
          selectionMode="Row"
        >
          <WjFlexGridColumn binding="code" header="코드" :isReadOnly="true" :width="100" />
          <WjFlexGridColumn binding="name" header="명" :isReadOnly="true" width="*" />
        </WjFlexGrid> -->
        {{ itemsSource }}
      </UItem>
    </UBox>

    <template #buttons>
      <UButton
        text="적용"
        type="primary"
        :disabled="disabledButton"
        @click="() => onGridRowDblClick(grid)"
      />
    </template>
  </UPopup>
</template>
<script lang="ts" setup>
import {
  defineProps,
  withDefaults,
  ref,
  reactive,
  toRaw,
  defineEmits,
  watchEffect,
  defineExpose,
  defineOptions,
} from "#moong/nuxt";
import { baseModels } from "#moong/core/data";
import { useVModel } from "@vueuse/core";
import { addWjGridEventHandler } from "#moong/nuxt-wijmo/composables";
import { useUstraCodeService } from "#moong/nuxt/management/services/code";

// prop & values
const props = withDefaults(
  defineProps<{
    /**
     * 그룹 코드
     */
    grpCd: string;

    /**
     * 넓이
     */
    width?: string | number;

    /**
     * 높이
     */
    height?: string | number;

    /**
     * 오픈 시 자동 조회
     */
    searchOnOopen?: boolean;

    /**
     * 팝업 오픈 여부
     */
    modelValue: boolean;
  }>(),
  {
    modelValue: false,
    width: 800,
    height: 700,
    searchOnOopen: true,
  }
);
const value = useVModel(props, "modelValue");

// for input
const inputValue = reactive({
  keyword: null,
});

const keywordInput = ref();

// grid data
const itemsSource = ref<baseModels.CodeNameModel[]>([]);
async function search() {
  const { getCodesByGroup } = useUstraCodeService();
  itemsSource.value = (await getCodesByGroup(props.grpCd))
    .filter((c) => {
      if (!inputValue.keyword) {
        return true;
      }

      return (
        (c.dtlCd &&
          c.dtlCd
            .toLocaleLowerCase()
            .includes(inputValue.keyword.toLocaleLowerCase())) ||
        (c.cdNm &&
          c.cdNm
            .toLocaleLowerCase()
            .includes(inputValue.keyword.toLocaleLowerCase()))
      );
    })
    .map((c) => {
      return {
        code: c.dtlCd,
        name: c.cdNm,
      };
    });
}
watchEffect(() => {
  if (value.value) {
    itemsSource.value = [];
    // inputValue.keyword = null
  }
});

// grid action
const emits = defineEmits<{
  (e: "selected", item: baseModels.CodeNameModel): void;
  (e: "update:modelValue", v: boolean): void;
}>();
const grid = ref();
function onGridRowDblClick(grid, col?, row?) {
  if (grid.selectedRows.length > 0) {
    emits("selected", toRaw(grid.selectedRows[0].dataItem));
    value.value = false;
  }
}

// button
const disabledButton = ref(true);

/**
 * input keyword and search
 * @param keyword
 */
async function inputAndSearch(keyword: string) {
  inputValue.keyword = keyword;

  if (keyword || props.searchOnOopen) {
    await search();

    if (itemsSource.value.length === 1) {
      emits("selected", toRaw(grid.value.selectedRows[0].dataItem));
      value.value = false;
    }
  }
}

defineExpose({ inputAndSearch });
</script>
<script lang="ts">
export default {
  name: "UVUserPopup",
};
</script>
