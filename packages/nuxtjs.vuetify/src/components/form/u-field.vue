<template>
  <template v-if="!blank">
    <UItem
      class="u-field"
      :class="uFieldClasses"
      :style="uFieldStyles"
      :ratio="ratio"
      :baseSize="totalWidth"
    >
      <div :style="labelStyles" :class="labelClasses" class="u-field-label">
        <template v-if="!$slots.label">
          <span :class="labelSpanClasses">{{ label }}</span>
        </template>
        <template v-if="$slots.label">
          <slot name="label" />
        </template>
      </div>

      <div class="u-field-slot" :class="slotClasses" :style="slotStyles">
        <slot />
      </div>
    </UItem>
  </template>

  <template v-if="blank">
    <UItem class="u-field" :class="uFieldClasses" :style="uFieldStyles">
      <div class="u-field-slot-blank"><slot /></div>
    </UItem>
  </template>
</template>

<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  nextTick,
  ref,
  onMounted,
  onUpdated,
} from "#moong/nuxt";
import { core } from "#moong/core/utils";
import { dom } from "#moong/core/utils/browser";
import { component } from "#moong/nuxt/utils";
import { useMounted, computedAsync } from "@vueuse/core";
import "./styles/form.scss";

const isMounted = useMounted();

const props = defineProps({
  totalWidth: {
    type: [Number, String],
    default: null,
  },
  width: {
    type: [String, Number],
    default: null,
  },
  ratio: {
    type: Number,
    default: 1,
  },
  direction: {
    type: String,
    default: "row",
  },
  itemDirection: {
    type: String,
    default: "col",
  },
  label: {
    type: String,
    default: null,
  },
  labelWidth: {
    type: [Number, String],
    default: 150,
  },
  required: {
    type: Boolean,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * Blank 옵션
   * blank : 빈칸 Field
   * top,right,bottom,left,center,middle : 위치조정
   */
  blank: {
    type: Boolean,
    default: false,
  },
  top: {
    type: Boolean,
    default: false,
  },
  right: {
    type: Boolean,
    default: true,
  },
  bottom: {
    type: Boolean,
    default: true,
  },
  left: {
    type: Boolean,
    default: false,
  },
  center: {
    type: Boolean,
    default: false,
  },
  middle: {
    type: Boolean,
    default: false,
  },
});

const evaluating = ref(false);
const currentInstance = getCurrentInstance();
const required = computedAsync(async () => {
  if (!core.isEmpty(props.required)) {
    return props.required;
  }

  if (!isMounted.value) {
    return false;
  }

  await nextTick();
  const requiredChildNodes = component.queryChildNodes(
    currentInstance.vnode,
    (node) => {
      if (node.props?.required || node.props?.isRequired) {
        return true;
      }

      if (node.props?.validation && node.props?.validation?.rules) {
        for (const rule of node.props?.validation?.rules) {
          if (rule === "required" || rule?.type == "required") {
            return true;
          }
        }
      }

      if (node.el) {
        const el = node.el as HTMLElement;

        if (el.hasAttribute("required")) {
          return true;
        }
      }
    }
  );

  return requiredChildNodes.length > 0;
}, false);

onMounted(() => (evaluating.value = true));
onUpdated(() => (evaluating.value = true));

const uFieldClasses = computed(() => {
  let classes = "";
  if (props.disabled) {
    classes += "u-form-state-disabled";
  }
  return classes;
});

const uFieldStyles = computed(() => {
  const obj: Record<string, any> = {};
  if (!props.blank) {
    if (props.direction === "col") {
      obj.flexDirection = "column";
      obj.justifyContent = "flex-start";
      obj.alignItems = "stretch";
    } else {
      obj.flexDirection = "row";
      obj.justifyContent = "flex-start";
    }
    if (props.totalWidth) {
      obj.maxWidth = dom.getCssUnit(props.totalWidth);
    }
  } else {
    if (props.right) {
      obj.justifyContent = "flex-end";
    }
    if (props.bottom) {
      obj.alignItems = "flex-end";
    }
    if (props.left) {
      obj.justifyContent = "flex-start";
    }
    if (props.center) {
      obj.justifyContent = "center";
    }
    if (props.middle) {
      obj.alignItems = "center";
    }
    if (props.top) {
      obj.alignItems = "flex-start";
    }
  }
  return obj;
});

const labelClasses = computed(() => {
  let classes = "";
  if (props.direction === "row") {
    classes += "row";
    if (props.left) {
      classes += " left";
    } else if (props.right) {
      classes += " right";
    }
  }
  if (props.direction === "col") {
    classes += "col";
  }
  return classes;
});

// let labelWidthFix: boolean
const labelStyles = computed(() => {
  const obj: Record<string, any> = {};
  if (props.direction === "row") {
    obj.width = dom.getCssUnit(props.labelWidth);
  } else {
    if (props.width) {
      obj.width = dom.getCssUnit(props.width);
    } else {
      obj.width = "100%";
    }
  }
  obj.minWidth = dom.getCssUnit(props.labelWidth);

  return obj;
});
const labelSpanClasses = computed(() => {
  let spanClass = "";
  if (required.value) {
    spanClass += "required";
  }
  return spanClass;
});
const slotClasses = computed(() => {
  let slotClass = "";
  if (props.itemDirection === "row") {
    slotClass += " row ";
  } else {
    slotClass += " col ";
  }
  return slotClass;
});
const slotStyles = computed(() => {
  const obj: Record<string, any> = {};
  if (props.width) {
    obj.minWidth = dom.getCssUnit(props.width);
  } else {
    obj.width = dom.getCssUnit("100%");
  }

  if (props.direction === "row") {
    obj.backgroundColor = "#fff";
  }
  return obj;
});
</script>

<style scoped lang="scss">
.u-field {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0;
}
.u-field-label {
  word-break: keep-all;
  font-weight: 600;
  display: flex;
  align-items: center;
  &.col {
    justify-content: flex-start;
    padding: 6px 11px;
  }
  &.row {
    padding: 6px 11px;
    border-left: 1px solid #e9e9e9;
    border-right: 1px solid #e9e9e9;
    height: 100%;
    font-size: 0.8125rem;
    font-weight: 600;
    text-align: right;
    vertical-align: middle;

    &.left {
      justify-content: flex-start;
      span {
        text-align: left;
      }
    }
    &.right {
      justify-content: flex-end;
      span {
        text-align: right;
      }
    }
  }
}

.u-field-slot {
  padding: 6px 11px;
  display: flex;

  &.row {
    flex-direction: row;
    gap: 11px;
  }
  &.col {
    flex-direction: column;
    gap: 8px;
  }
}
.u-field-slot-blank {
  width: 100%;
}
</style>
