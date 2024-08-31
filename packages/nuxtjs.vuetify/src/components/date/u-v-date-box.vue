<template>
  <div v-if="mode === 'date'">
    <DatePicker v-model="dateValue" mode="date">
      <template v-slot="{ showPopover, hidePopover }">
        <VTextField
          v-model="displayValue"
          :readonly="readonly"
          @focusin="readonly ? hidePopover() : showPopover()"
          @focusout="displayValueUpdated() && hidePopover()"
          @change="displayValueUpdated() && hidePopover()"
          @keyup.enter="hidePopover()"
          @keyup.tab="hidePopover()"
        />
      </template>
    </DatePicker>
  </div>

  <div v-if="mode === 'datetime'">
    <DatePicker v-model="dateValue" mode="datetime" is24hr>
      <template v-slot="{ showPopover, hidePopover }">
        <VTextField
          v-model="displayValue"
          :readonly="readonly"
          @focusin="readonly ? hidePopover() : showPopover()"
          @focusout="displayValueUpdated() && hidePopover()"
          @change="displayValueUpdated() && hidePopover()"
          @keyup.enter="hidePopover()"
          @keyup.tab="hidePopover()"
        />
      </template>
    </DatePicker>
  </div>

  <div v-if="mode === 'year'">
    {{ displayValue }}
    <v-combobox
      class="u-date-box-combo"
      :items="yearComboSource"
      v-model="displayValue"
      :readonly="readonly"
      @update:modelValue="displayValueUpdated()"
    ></v-combobox>
  </div>
</template>

<script lang="ts" setup>
// modelValue -> dateValue
// displayValue -> dateValue
// dateValue -> modelValue, displayValue
import {
  computed,
  useAttrs,
  ref,
  watch,
  onMounted,
  reactive,
  watchEffect,
} from "vue";
import { DatePicker } from "v-calendar";
import { useLogger } from "#moong/core";
import { useVModel } from "@vueuse/core";

interface UVDateBoxProps {
  mode?: "date" | "year" | "datetime";
  modelValue?: string;
  displayFormat?: string;
  valueFormat?: string;
  isDefaultValue?: boolean;
  readonly?: boolean;
}

const props = withDefaults(defineProps<UVDateBoxProps>(), {
  mode: "date",
  modelValue: null,
  isDefaultValue: false,
  readonly: false,
});

const modelValue = useVModel(props, "modelValue");

const dateValue = ref(null);

const yearComboSource = ref<String[]>([]);
for (let i = 1990; i <= 2050; i++) {
  yearComboSource.value.push(i.toString());
}

const formats = computed(() => {
  return {
    display() {
      if (props.displayFormat) {
        return props.displayFormat;
      }

      switch (props.mode) {
        case "date":
          return "yyyy-MM-dd";
        case "datetime":
          return "yyyy-MM-dd HH:mm:ss";
        case "year":
          return "yyyy";
      }

      return null;
    },

    value() {
      if (props.valueFormat) {
        return props.valueFormat;
      }

      switch (props.mode) {
        case "date":
          return "yyyyMMdd";
        case "datetime":
          return "yyyyMMddHHmmss";
        case "year":
          return "yyyy";
      }

      return null;
    },
  };
});

const displayValue = ref<string>(null);

const initDateValue = () => {
  dateValue.value = new Date();
  if (props.isDefaultValue && !modelValue.value) {
    dateValue.value = new Date();
    return;
  }

  if (!modelValue.value) {
    dateValue.value = null;
  }

  if (props.mode === "year") {
    dateValue.value = $ustra.utils.date.parse(modelValue.value, "yyyy");
  } else {
    const format = formats.value.value();
    if (!format) {
      return null;
    }
    dateValue.value = $ustra.utils.date.parse(modelValue.value, format);
  }
};

onMounted(() => {
  initDateValue();
});

watch(
  () => modelValue.value,
  (a) => {
    useLogger().debug("modelValue updated", a);
    if (!a) {
      dateValue.value = null;
      return;
    }

    useLogger().debug("props.mode", props.mode);

    const format = formats.value.value();
    useLogger().debug("format", format);
    if (!format) {
      return null;
    }

    dateValue.value = $ustra.utils.date.parse(modelValue.value, format);
  }
);

watch(
  () => dateValue.value,
  (a) => {
    useLogger().debug("dateValue updated", a);

    updateDisplayValue(a);
    updateModelValue(a);
  }
);

const updateDisplayValue = (dateValue: Date) => {
  if (!dateValue) {
    displayValue.value = null;
    return;
  }
  // display
  const displayFormat = formats.value.display();
  useLogger().debug("displayFormat", displayFormat);
  if (!displayFormat) {
    return;
  }

  const formatted = $ustra.utils.date.format(dateValue, displayFormat);
  useLogger().debug(
    "$ustra.utils.date.format(dateValue.value as Date, displayFormat)",
    formatted
  );
  // displayValue.value
  useLogger().debug("displayValue.value", displayValue.value);
  if (formatted === displayValue.value) {
    return;
  }
  displayValue.value = formatted;
};

const updateModelValue = (dateValue: Date) => {
  if (!dateValue) {
    modelValue.value = null;
    return;
  }
  // display
  const valueFormat = formats.value.value();
  useLogger().debug("valueFormat", valueFormat);
  if (!valueFormat) {
    return;
  }

  const formatted = $ustra.utils.date.format(dateValue, valueFormat);
  useLogger().debug(
    "$ustra.utils.date.format(dateValue.value as Date, valueFormat)",
    formatted
  );
  // displayValue.value
  useLogger().debug("modelValue.value", modelValue.value);
  if (formatted === modelValue.value) {
    return;
  }
  modelValue.value = formatted;
};

const displayValueUpdated = () => {
  useLogger().debug("displayValue updated", displayValue.value);
  if (!displayValue.value) {
    dateValue.value = null;
    return;
  }

  useLogger().debug("props.mode", props.mode);

  const format = formats.value.display();
  useLogger().debug("format", format);
  if (!format) {
    return null;
  }

  let newDateValue = null;
  try {
    newDateValue = $ustra.utils.date.parse(displayValue.value, format);
  } catch (e) {}

  if (newDateValue) {
    dateValue.value = newDateValue;
    return;
  }

  try {
    dateValue.value = $ustra.utils.date.parse(
      displayValue.value,
      formats.value.value()
    );
  } catch (e) {}
};
</script>
<style scoped lang="scss">
.u-date-box-combo {
  width: 110%;
  padding-right: 10px;
}
</style>
