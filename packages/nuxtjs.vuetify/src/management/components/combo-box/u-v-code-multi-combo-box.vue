<template>
  <v-select
    :items="itemsSource"
    :auto-select-first="isAutoSelectFirst"
    v-model="comboValue"
    :item-title="props.itemTitle"
    :item-value="props.itemValue"
    :item-props="itemProps"
    multiple
  >
  </v-select>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults, watch, defineOptions } from "#moong/nuxt";

defineOptions({
  inheritAttrs: false,
});

interface CodeComboBoxProps {
  /**
   * 그룹 코드
   */
  grpCd: string;

  /**
   * 사용 중인 코드 값만 조회 여부
   */
  onlyUse?: boolean;

  /**
   * 코드 디스플레이 여부
   */
  displayCode?: boolean;

  /**
   * 목록 커스토마이징 function
   */
  customizeItems?: (codes: CodeItem[]) => CodeItem[];

  /**
   * 이름 순 정렬 여부
   */
  sortByName?: boolean;

  /**
   * 코드 순 정렬 여부
   */
  sortByCode?: boolean;

  /**
   * null value text
   */
  displayNullText?: string;

  /**
   * object value
   */
  objectValue?: CodeItem;

  /**
   * combobox Label
   */
  itemTitle?: string;

  /**
   * combobox value
   */
  itemValue?: string;
}

/* @vue-ignore */
interface UCodeComboBoxProps extends CodeComboBoxProps {
  /**
   * model value
   */
  modelValue?: object;
}

/* @vue-ignore */
const props = withDefaults(defineProps<UCodeComboBoxProps>(), {
  onlyUse: true,
  modelValue: null,
  objectValue: null,
  displayCode: false,
  customizeItems: null,
  sortByName: false,
  sortByCode: false,
  displayNullText: null,
  itemTitle: "display",
  itemValue: "value",
});

const { comboValue, itemsSource, vmodelValue, objectValue } =
  useComboComponent(props);

const isAutoSelectFirst = ref(true);
onMounted(() => {
  isAutoSelectFirst.value = true;
});

const itemProps = (v) => {
  return {
    display: v.display,
    value: v.value,
  };
};

watch(
  itemsSource,
  (v) => {
    // select first value
    if (!comboValue.value && v.length > 0) {
      comboValue.value = v[0];
    }
  },
  {
    immediate: true,
  }
);
</script>
<script lang="ts">
export default {
  name: "UVCodeMultiComboBox",
};
</script>
