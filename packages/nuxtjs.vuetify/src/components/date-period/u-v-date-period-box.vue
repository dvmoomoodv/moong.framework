<template>
    <div class="u-v-date-period-box">
      <div class="u-v-date-period-item">
        <UVDateBox
          v-model="startValue"
          :mode="mode"
          :displayFormat="displayFormat"
          :valueFormat="valueFormat"
          :isDefaultValue="isDefaultValue"
          :readonly="readonly"
        />
      </div>
      <div class="u-v-date-period-box-divider">~</div>
      <div class="u-v-date-period-item">
        <UVDateBox
          v-model="endValue"
          :mode="mode"
          :displayFormat="displayFormat"
          :valueFormat="valueFormat"
          :isDefaultValue="isDefaultValue"
          :readonly="readonly"
        />
    </div>
    </div>
</template>

<script lang="ts" setup>
import UVDateBox from '../date/u-v-date-box.vue'
import { useVModel } from '@vueuse/core'
import { computed, onMounted, ref, watch } from '#ustra/nuxt'
import { nextTick } from 'process';

interface UVDatePeriodPeriod {
  mode?: 'date' | 'datetime' | 'year',
  modelValue?: string[]
  displayFormat?: string
  valueFormat?: string
  isDefaultValue?: boolean
  readonly?: boolean
}

const props = withDefaults(defineProps<UVDatePeriodPeriod>(), {
  mode: 'date',
  isDefaultValue: false,
  readonly: false,
})

console.log('props', props)

const modelValue = useVModel(props, 'modelValue')
console.log('modelValue', modelValue)

const startValue = ref<string>(null)

const endValue = ref<string>(null)

onMounted(() => {
  if(!modelValue.value) {
    return
  }

  startValue.value = modelValue.value[0]
  endValue.value = modelValue.value[1]
})

watch(() => startValue.value, () => {
  if(!modelValue.value || modelValue.value.length !== 2) {
    modelValue.value = [startValue.value, null]
    return
  }

  modelValue.value = [startValue.value, endValue.value]
})

watch(() => endValue.value, () => {
  if(!modelValue.value || modelValue.value.length !== 2) {
    modelValue.value = [endValue.value, null]
    return
  }

  modelValue.value = [startValue.value, endValue.value]
})

</script>
<style scoped lang="scss">
.u-v-date-period-box-divider {
  padding: 0.2rem 1rem 0;
}
.u-v-date-period-box {
  display: flex;
}
.u-v-date-period-item {
  width: 130px;
}
</style>
