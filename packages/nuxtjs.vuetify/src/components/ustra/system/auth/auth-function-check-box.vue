<template>
    <span class="group-auth-function-check-box-container">
        <span v-if="!isFirst"> / </span>
        <span class="group-auth-function-check-box" :class="{ selected: selected, disabled: disabled }" @click.stop="onClick">
            {{ text }}
        </span>
    </span>
</template>
<script lang="ts" setup>
// const props = defineProps(['isFirst', 'text', 'disabled', 'modelValue'])
const props = defineProps<{
    modelValue: string
    isFirst?: boolean
    text?: string
    disabled?: boolean
}>()

const isFirst = props.isFirst
const text = props.text
const disabled = props.disabled
// const value = props.modelValue
const modelValue = useVModel(props, 'modelValue')

const selected = computed({
    get: () => {
        return modelValue.value === 'Y'
    },
    set: (value) => {
        modelValue.value = value ? 'Y' : 'N'
    }
})

const onClick = () => {
    if(disabled){
        return
    }
    selected.value = !selected.value
}
</script>
<style>
.group-auth-function-check-box-container {
    vertical-align: unset !important;
}
.group-auth-function-check-box {
    vertical-align: unset !important;
    margin: 0 2px;
    color: #aaa;
    text-decoration: line-through;
}
.group-auth-function-check-box.selected {
    text-decoration: none;
    color: #3cbab2;
}
</style>
  