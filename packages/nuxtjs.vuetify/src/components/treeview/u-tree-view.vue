<template>
  <div>
    <treeview
      ref="treeviewComponent"
      v-if:="nodesValue !== null && configValue !== null"
      :nodes="nodesValue"
      :config="configValue"
      @nodeOpened="opened"
      @nodeClosed="closed"
      @nodeFocus="focus"
      @nodeToggle="toggle"
      @nodeBlur="blur"
      @nodeEdit="edit"
      @nodeChecked="checked"
      @nodeUnchecked="unchecked"
      @nodeDragstart="dragstart"
      @nodeDragenter="dragenter"
      @nodeDragleave="dragleave"
      @nodeDragend="dragend"
      @nodeOver="over"
      @nodeDrop="drop"
    ></treeview>
  </div>
</template>

<script lang="ts" setup>
import treeview from 'vue3-treeview'
const treeviewComponent = ref(null)
const props = defineProps({
  modelValue: {
    type: Array,
    default: [],
  },
  keyboardNavigation: {
    type: Boolean,
    default: false,
  },
  dragAndDrop: {
    type: Boolean,
    default: false,
  },
  checkboxes: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  padding: {
    type: Number,
    default: 25,
  },
  treeviewOpened: {
    type: Function,
    default: () => {},
  },
  treeviewClosed: {
    type: Function,
    default: () => {},
  },
  treeviewFocus: {
    type: Function,
    default: () => {},
  },
  treeviewToggle: {
    type: Function,
    default: () => {},
  },
  treeviewBlur: {
    type: Function,
    default: () => {},
  },
  treeviewEdit: {
    type: Function,
    default: () => {},
  },
  treeviewChecked: {
    type: Function,
    default: () => {},
  },
  treeviewUnchecked: {
    type: Function,
    default: () => {},
  },
  treeviewDragstart: {
    type: Function,
    default: () => {},
  },
  treeviewDragenter: {
    type: Function,
    default: () => {},
  },
  treeviewDragleave: {
    type: Function,
    default: () => {},
  },
  treeviewDragend: {
    type: Function,
    default: () => {},
  },
  treeviewOver: {
    type: Function,
    default: () => {},
  },
  treeviewDrop: {
    type: Function,
    default: () => {},
  },
})
const treeStructure = ref(null)
const nodesValue = ref(null)
const configValue = ref(null)

onMounted(() => {
  treeStructure.value = useBuildMenuTree(props.modelValue, {
    keyboardNavigation: props.keyboardNavigation,
    dragAndDrop: props.dragAndDrop,
    checkboxes: props.checkboxes,
    editable: props.editable,
    disabled: props.disabled,
    padding: props.padding,
  })
  configValue.value = treeStructure.value.config
  nodesValue.value = treeStructure.value.nodes
})
const checkedItems = ref([])
/**
 * Node Event
 */
const opened = node => {
  // console.log('component opened event = ', node)
  if (props.treeviewOpened) props.treeviewOpened(node)
}
const closed = node => {
  // console.log('component closed event = ', node)
  if (props.treeviewClosed) props.treeviewClosed(node)
}
const focus = node => {
  // console.log('component focus event = ', node)
  if (props.treeviewFocus) props.treeviewFocus(node)
}
const toggle = node => {
  // console.log('component toggle event = ', node)
  if (props.treeviewToggle) props.treeviewToggle(node)
}
const blur = node => {
  // console.log('component blur event = ', node)
  if (props.treeviewBlur) props.treeviewBlur(node)
}
const edit = node => {
  // console.log('component edit event = ', node)
  if (props.treeviewEdit) props.treeviewEdit(node)
}
const checked = node => {
  // console.log('component checked event = ', node)
  checkedItems.value.push(node)
  if (props.treeviewChecked) props.treeviewChecked(node)
}
const unchecked = node => {
  // console.log('component unchecked event = ', node)
  checkedItems.value = checkedItems.value.filter(items => {
    return items.id !== node.id
  })
  if (props.treeviewUnchecked) props.treeviewUnchecked(node)
}

/**
 * Context Event
 */
const dragstart = context => {
  // console.log('component dragstart event = ', context)
  if (props.treeviewDragstart) props.treeviewDragstart(context)
}
const dragenter = context => {
  // console.log('component dragenter event = ', context)
  if (props.treeviewDragenter) props.treeviewDragenter(context)
}
const dragleave = context => {
  // console.log('component dragleave event = ', context)
  if (props.treeviewDragleave) props.treeviewDragleave(context)
}
const dragend = context => {
  // console.log('component dragend event = ', context)
  if (props.treeviewDragend) props.treeviewDragend(context)
}
const over = context => {
  // console.log('component over event = ', context)
  if (props.treeviewOver) props.treeviewOver(context)
}
const drop = context => {
  // console.log('component drop event = ', context)
  if (props.treeviewDrop) props.treeviewDrop(context)
}

defineExpose({
  checkedItems: checkedItems,
})
</script>
<script lang="ts">
export default {
  name: 'UTreeView',
}
</script>

<style></style>
