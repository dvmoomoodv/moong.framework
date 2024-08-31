<template>
  <div>
    <input :type="type" v-bind="attrs" v-model="modelValue" />

    <!-- <br />  -->

    <!-- <template v-if="type === 'date'" > type date :</template> -->
    <!-- <template v-if="type === 'datetime-local'" v-bind="attrs" :value="modelValue">
      type datetime-local : <input type="datetime-local" /><br />
    </template>
    <template v-if="type === 'month'" v-bind="attrs" :value="modelValue"> type month : <input type="month" /><br /> </template>
    <template v-if="type === 'week'" v-bind="attrs" :value="modelValue"> type week : <input type="week" /><br /> </template>
    <template v-if="type === 'time'" v-bind="attrs" :value="modelValue"> type time : <input type="time" /><br /> </template> -->
  </div>
</template>

<script lang="ts" setup>
/**
 * https://developer.mozilla.org/ko/docs/Web/HTML/Element/input/date
 */
import { defineModel } from "#moong/nuxt";
import { core } from "#moong/core/utils";

/**
 * value -> modelValue
 *
 * type : date
 * attribute : value, max, min, step
 * validation : required
 * pattern : browser 체크 필요
 *
 *
 * type : datetime-local
 * attribute : value, max, min, step
 * validation : required
 *
 *
 * type : month
 * attribute : list, max, min, readonly, step
 * validation : required
 * pattern : browser 체크 필요
 *
 *
 * type : week
 * attribute: max, min, readonly, step
 * validation: required
 * pattern : browser 체크 필요
 *
 * type : time
 * attribute: list, max, min, readonly, step
 * validation: required
 * pattern : browser 체크 필요
 */
const modelValue = defineModel();
const type = defineModel<string>("type", { default: "date" });
const attrs = computed(() => {
  const $attrs = useAttrs();
  return core.deepMerge($attrs);
});
</script>

<script lang="ts">
export default {
  name: "UBaseDatepicker",
  inheritAttrs: false,
};
</script>

<style lang="scss"></style>
