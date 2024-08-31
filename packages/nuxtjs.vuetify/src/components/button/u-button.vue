<template>
  <template v-if="!String(icon).includes('mdi')">
    <button
      v-bind="$attrs"
      class="u-button"
      type="button"
      :class="classes"
      :style="buttonStyles"
    >
      {{ text }}
    </button>
  </template>
  <template v-if="String(icon).includes('mdi')">
    <button
      v-bind="$attrs"
      class="u-button"
      type="button"
      :class="classes"
      :style="buttonStyles"
    >
      <VIcon v-if="!right" :color="mdiIconColor">{{ icon }}</VIcon>
      {{ text }}
      <VIcon v-if="right" :color="mdiIconColor">{{ icon }}</VIcon>
    </button>
  </template>
</template>

<script setup lang="ts">
import { computed } from "#moong/nuxt";
import { dom } from "#moong/core/utils/browser";
import { VIcon } from "vuetify/components";

const props = defineProps({
  type: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: "",
  },
  mdiIconColor: {
    type: String,
    default: null,
  },
  width: {
    type: [Number, String],
    default: null,
  },
  small: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: null,
  },
  right: {
    type: Boolean,
    default: false,
  },
});

const buttonStyles = computed(() => {
  const obj: Record<string, any> = {};
  if (props.width) {
    obj.width = dom.getCssUnit(props.width);
    obj.minWidth = dom.getCssUnit(props.width);
  }
  // text가 없을때는 auto 처리
  if (!props.text) {
    obj.minWidth = "auto";
  }
  return obj;
});

const classes = computed(() => {
  let returnClasses = "";
  if (props.type) {
    returnClasses += props.type + " ";
  }
  if (!props.small) {
    returnClasses += "big";
  }
  if (props.icon) {
    let icon = "";
    if (props.icon === "pin") {
      icon += "ico_pin";
    } else if (props.icon === "arr") {
      icon += "ico_arr";
    } else if (props.icon === "arr-up") {
      icon += "ico_arr t";
    } else if (props.icon === "arr-down") {
      icon += "ico_arr d";
    } else if (props.icon === "arr-left") {
      icon += "ico_arr l";
    } else if (props.icon === "arr-right") {
      icon += "ico_arr r";
    } else if (props.icon === "reset") {
      icon += "ico_reset";
    } else if (props.icon === "bookmark") {
      icon += "ico_bookmark";
    } else if (props.icon === "find") {
      icon += "ico_find02";
    } else if (props.icon === "filter") {
      icon += "ico_filter";
    } else if (props.icon === "excel") {
      icon += "ico_excel";
    } else if (props.icon === "search") {
      icon += "ico_search";
    }
    returnClasses += " " + icon;
  }
  return returnClasses;
});
</script>
