<template>
  <div :style="styles">
    <ul class="group_btn_list" v-if="type === 'checkbox'">
      <li
        v-for="(item, index) in modelValue"
        :key="index"
        @click="
          e => {
            if (e.target['tagName'] === 'LABEL') {
              e.stopPropagation()
            }
          }
        "
      >
        <input type="checkbox" :id="id + index" :value="item.value" v-model="props.checkValueArray" :readonly="readonly" :disabled="disabled" />
        <label :for="id + index">{{ item.label }}</label>
      </li>
    </ul>

    <ul class="group_btn_list" v-if="type === 'radio'">
      <li
        v-for="(item, index) in modelValue"
        :key="index"
        @click="
          e => {
            if (e.target['tagName'] === 'LABEL') {
              e.stopPropagation()
            }
          }
        "
      >
        <input
          type="radio"
          :id="id + index"
          :name="name"
          :value="item.value"
          :v-model="props.checkValue"
          :readonly="readonly"
          :disabled="disabled"
          :checked="props.checkValue === item.value"
          @change="e => $emit('update:checkValue', e.target['value'])"
        />
        <label :for="id + index">{{ item.label }}</label>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, watch } from '#ustra/nuxt'
import { dom } from '#ustra/core/utils/browser'

const name = $ustra.utils.system.uuidBase62()

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
  type: {
    type: String,
    default: 'checkbox',
  },
  id: {
    type: String,
    default: 'button-group',
  },
  checkValueArray: {
    type: Array as PropType<any[]>,
    default: [''],
  },
  checkValue: {
    type: String,
    default: '',
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  width: {
    type: [String, Number],
    default: null,
  },
})

const styles = computed(() => {
  const obj: Record<string, any> = {}
  obj.width = dom.getCssUnit(props.width)
  obj.minWidth = dom.getCssUnit(props.width)
  return obj
})
</script>
