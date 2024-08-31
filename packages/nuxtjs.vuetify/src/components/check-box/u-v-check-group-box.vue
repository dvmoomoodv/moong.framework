<template>
  <ul
    class="group_btn_list"
    :class="{ 'no-border': !props.border }"
    :style="styles"
  >
    <li
      v-for="(item, index) in props.itemsSource"
      :key="index"
      :style="{
        textAlign: props.itemAlign,
        width: props.stack ? 'auto' : null,
      }"
    >
      <input
        type="checkbox"
        :id="name + index"
        :name="name"
        :disabled="item.disabled"
        v-model="values[index]"
        :true-value="trueValue(item.trueValue)"
        :false-value="falseValue(item.falseValue)"
      />
      <label :for="name + index" @click="(e) => onItemClick(e, item, index)">{{
        item.text
      }}</label>
    </li>
  </ul>
</template>
<script lang="ts" setup>
import {
  defineProps,
  withDefaults,
  defineEmits,
  computed,
  watch,
  reactive,
  nextTick,
} from "#moong/nuxt";
import { system } from "#moong/core/utils";
import { useVModel, watchArray } from "@vueuse/core";

type CheckGroupBoxMouseEvent = MouseEvent & {
  index: number;
  value: any;
  item: any;
};

const name = system.uuidBase62();
const props = withDefaults(
  defineProps<{
    /**
     * 입력 값
     */
    modelValue: any;

    /**
     * border 표시 여부
     * @default false
     */
    border?: boolean;

    /**
     * 아이템 정렬
     * @default 'center'
     */
    itemAlign?: "center" | "right" | "left";

    /**
     * 각 항목이 stack 형태로 left 정렬 여부
     * @default false
     */
    stack?: boolean;

    /**
     * item direction
     * @default row
     */
    direction?: "column" | "row";

    /**
     * itemsSource가 단일 값일 경우, 자동으로 value는 array가 아닌 단일 값으로 처리되나
     * 해당 속성이 true일 경우는 항상 array로 세팅된다.
     */
    multiple?: boolean;

    /**
     * 아이템 목록
     */
    itemsSource: {
      /**
       * value for true
       */
      trueValue?: any;

      /**
       * value for false
       */
      falseValue?: any;

      /**
       * text
       */
      text: string;

      /**
       * 비활성화 여부
       */
      disabled?: any;

      /**
       * 전체 선택 기능 아이템 여부
       */
      allSelectedItem?: boolean;
    }[];
  }>(),
  {
    border: false,
    itemAlign: "center",
    stack: false,
    multiple: false,
  }
);

const emits = defineEmits<{
  (e: "click", evt: CheckGroupBoxMouseEvent): void;
  (e: "update:modelValue", value: any): void;
}>();

const model = useVModel(props, "modelValue");
const values = computed({
  get() {
    if (!model.value) {
      return reactive(
        props.itemsSource.map((s) => {
          return $ustra.utils.core.defaults(s.falseValue, false);
        })
      );
    }

    return Array.isArray(model.value) ? model.value : reactive([model.value]);
  },
  set(v: any) {
    model.value = !isMultiple.value ? v[0] : v;
  },
});

const isMultiple = computed(() => {
  return props.multiple || props.itemsSource.length > 1;
});

watch(
  values,
  (v) => {
    model.value = !isMultiple.value ? v[0] : v;
  },
  {
    deep: true,
  }
);

const styles = computed(() => {
  const styles: Record<string, any> = {};
  if (!isMultiple.value) {
    styles.display = "inline-block";
    styles.marginRight = "10px";
    styles.width = "auto";
  }

  if (props.stack) {
    styles.gap = "1px 20px";
    styles.flexWrap = "wrap";
  }

  if (props.direction === "column") {
    styles.flexDirection = "column";
  }

  return styles;
});

const trueValue = (value) => {
  return $ustra.utils.core.defaults(value, true);
};

const falseValue = (value) => {
  return $ustra.utils.core.defaults(value, false);
};

async function onItemClick(e, item, index) {
  if (item.disabled) {
    return;
  }

  // 전체 선택
  if (item.allSelectedItem) {
    const v = !values.value[index];
    for (let i = 0; i < values.value.length; i++) {
      if (i === index) {
        continue;
      }
      setTimeout(
        () =>
          (values.value[i] = v
            ? trueValue(props.itemsSource[i].trueValue)
            : falseValue(props.itemsSource[i].falseValue)),
        1
      );
    }
    e.value = v;
  } else {
    if (!isMultiple.value) {
      const v =
        values.value[index] === trueValue(item.trueValue)
          ? falseValue(item.falseValue)
          : trueValue(item.trueValue);
      e.value = v;
    } else {
      const v = $ustra.utils.core.deepMerge([], values.value);
      v[index] =
        v[index] === trueValue(item.trueValue)
          ? falseValue(item.falseValue)
          : trueValue(item.trueValue);
      e.value = v;
    }
  }

  e.item = item;
  e.index = index;

  emits("click", e);
}
</script>
<script lang="ts">
export default {
  name: "UVCheckGroupBox",
};
</script>
