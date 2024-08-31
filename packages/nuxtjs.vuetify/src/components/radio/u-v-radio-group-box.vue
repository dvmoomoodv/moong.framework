<template>
  <v-radio-group v-model="model">
    {{ props.itemSource }}
    <v-radio v-for="item in props.itemsSource" :key="item.value" :label="item.text" :value="item.value" />
  </v-radio-group>
</template>
<script lang="ts" setup>
import { defineProps, withDefaults, defineEmits, computed } from '#ustra/nuxt'
import { system } from '#ustra/core/utils'
import { useVModel } from '@vueuse/core'

const name = computed(() => {
  return props.name || system.uuidBase62()
})

const props = withDefaults(
  defineProps<{
    modelValue: any

    /**
     * radio button id
     */
    id?: string

    /**
     * radio button name
     */
    name?: string

    /**
     * item 템플릿 명
     */
    itemTemplate?: string

    /**
     * content 템플릿
     */
    contentTemplate?: string

    /**
     * item direction
     * @default row
     */
    direction?: 'column' | 'row'

    /**
     * 아이템 정렬
     * @default 'center'
     */
    itemAlign?: 'center' | 'right' | 'left'

    /**
     * radio button 목록
     */
    itemsSource: {
      /**
       * value
       */
      value: any

      /**
       * text
       */
      text: string

      /**
       * 비활성화 여부
       */
      disabled?: any
    }[]
  }>(),
  {
    itemTemplate: 'item',
    itemAlign: 'center',
    contentTemplate: 'content',
    name: null,
  },
)

const emits = defineEmits<{
  (e: 'click', evt: MouseEvent): void
  (e: 'update:modelValue', value: any): void
}>()

// function onClick(e, item, index) {
//   if (item.disabled) {
//     return
//   }
//   e.value = item.value
//   emits('click', e)
// }
const model = useVModel(props, 'modelValue')

// const styles = computed(() => {
//   const styles: Record<string, any> = {}

//   if (props.direction === 'column') {
//     styles.flexDirection = 'column'
//   }

//   if (props.itemAlign) {
//     styles.alignItems = props.itemAlign === 'left' ? 'flex-start' : props.itemAlign === 'right' ? 'flex-end' : 'center'
//   }

//   return styles
// })
</script>
<script lang="ts">
export default {
  name: 'UVRadioGroupBox',
}
</script>
