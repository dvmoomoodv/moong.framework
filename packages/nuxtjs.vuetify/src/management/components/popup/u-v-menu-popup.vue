<template>
  <UPopup v-model="modelValue" :title="props.title" :width="800" :height="600">
    <UBox direction="col">
      <UItem v-if="props.canSelectSysCd">
        <UButtonBar>
          <UFieldSet>
            <UFieldRow>
              <UField label="시스템" direction="col" :totalWidth="300">
                <uVCodeComboBox grpCd="SYS_CD" v-model="currentSysCd" />
              </UField>
            </UFieldRow>
          </UFieldSet>
        </UButtonBar>
      </UItem>
      <UItem :ratio="1" scrollType="auto">
        <UTreeView
          ref="treeviewRef"
          v-model="treeItemsSource"
          :checkboxes="props.multiple"
          :treeviewOpened="opened"
          :treeviewClosed="closed"
          :treeviewFocus="focus"
          :treeviewToggle="toggle"
          :treeviewBlur="blur"
          :treeviewEdit="edit"
          :treeviewChecked="checked"
          :treeviewUnchecked="unchecked"
          :treeviewDragstart="dragstart"
          :treeviewDragEnter="dragenter"
          :treeviewDragleave="dragleave"
          :treeviewDragend="dragend"
          :treeviewOver="over"
          :treeviewDrop="drop"
        />
      </UItem>
    </UBox>
    <template #buttons>
      <UButtonBar style="width: 100%">
        <UButtonBox right>
          <!-- <UButton right text="적용" type="primary" :disabled="!isEnableApplyButton" @click="onClickApplyButton" /> -->
          <!-- :disabled="!isEnableApplyButton"-->
          <VBtn @click="onClickApplyButton">적용</VBtn>
        </UButtonBox>
      </UButtonBar>
    </template>
  </UPopup>
</template>
<script lang="ts" setup>
import { defineProps, withDefaults, computed, ref, defineOptions } from '#ustra/nuxt'
import { Menu, useUstraCodeList, useUstraUserService } from '#ustra/nuxt/management'
import uVCodeComboBox from '../combo-box/u-v-code-combo-box.vue'
// import { UCodeComboBox } from '#ustra/nuxt-wijmo/management/components'
// import { useWijmoTreeView } from '#ustra/nuxt-wijmo/composables'
import { useVModel } from '@vueuse/core'
import treeview from 'vue3-treeview'
import UTreeView from '../../../components/treeview/u-tree-view.vue'

const userService = useUstraUserService()
const treeviewRef = ref(null)
const props = withDefaults(
  defineProps<{
    /**
     * 팝업 오픈 여부
     */
    modelValue: boolean
    /**
     * 팝업 제목
     * @default '메뉴 조회'
     */
    title?: string

    /**
     * 멀티 선택 여부
     * @default false
     */
    multiple?: boolean

    /**
     * 기본 선택 시스템 코드
     */
    defaultSysCd?: string

    /**
     * 시스템 코드 선택 가능 여부
     * @default true
     */
    canSelectSysCd?: boolean
  }>(),
  { title: '메뉴 조회', multiple: false, defaultSysCd: null, canSelectSysCd: true },
)

const emits = defineEmits<{
  (e: 'selected', item: Menu | Menu[]): void
  (e: 'update:modelValue', v: boolean): void
}>()
const modelValue = useVModel(props, 'modelValue')

// conditions
const currentSysCd = ref(props.defaultSysCd || useUstraCodeList('SYS_CD')[0].dtlCd)

// teee
// const treeView = useWijmoTreeView<Menu>({
//   useCheckSelection: props.multiple,
//   onAfterInitialized(ctl) {
//     ctl.loadedItems.addHandler(() => {
//       treeView.collapseAll()
//     })
//   },
//   onDblClick() {
//     if (!props.multiple && treeView.selectedItem.value) {
//       onClickApplyButton()
//     }
//   },
// })

const treeItemsSource = computed(() => {
  const menus = $ustra.utils.core.deepMerge(
    [],
    $ustra.management.store.initData.programMenus.filter(menu => {
      return menu.sysCd === currentSysCd.value && menu.delYn === 'N'
    }),
  )
  // const displayMenus: Menu[] = []
  // for (const menu of menus) {
  //   if (!menu.uprMnuId) {
  //     menu.fullNames = menu.mnuNm
  //     displayMenus.push(menu)
  //   } else {
  //     const parentMenu = displayMenus.find(m => m.mnuId === menu.uprMnuId)
  //     if (parentMenu) {
  //       menu.fullNames = parentMenu.fullNames + ' > ' + menu.mnuNm
  //       parentMenu.items = parentMenu.items || []
  //       parentMenu.items.push(menu)
  //     }
  //   }
  // }
  return menus
})

const selectedItem = ref(null)
/**
 * Node Event
 */
function opened(node) {
  console.log('page opened event = ', node)
}
function closed(node) {
  console.log('page closed event = ', node)
}
function focus(node) {
  selectedItem.value = node
  console.log('page focus event = ', node)
}
function toggle(node) {
  console.log('page toggle event = ', node)
}
function blur(node) {
  console.log('page blur event = ', node)
}
function edit(node) {
  console.log('page edit event = ', node)
}
function checked(node) {
  console.log('page checked event = ', node)
}
function unchecked(node) {
  console.log('page unchecked event = ', node)
}

/**
 * Context Event
 */
function dragstart(context) {
  console.log('page dragstart event = ', context)
}
function dragenter(context) {
  console.log('page dragenter event = ', context)
}
function dragleave(context) {
  console.log('page dragleave event = ', context)
}
function dragend(context) {
  console.log('page dragend event = ', context)
}
function over(context) {
  console.log('page over event = ', context)
}
function drop(context) {
  console.log('page drop event = ', context)
}

// button
// const isEnableApplyButton = computed(() => {
//   if (!props.multiple) {
//     return !!treeView.selectedItem.value
//   } else {
//     return treeView.checkedItems.value.length > 0
//   }
// })

function onClickApplyButton() {
  if (!props.multiple) {
    const selectedValue = $ustra.utils.core.deepMerge({}, selectedItem.value)
    delete selectedValue.items
    emits('selected', selectedValue)

    modelValue.value = false
  } else {
    console.log(treeviewRef.value)
    const checkedValues = $ustra.utils.core.deepMerge([], treeviewRef.value.checkedItems)
    for (const c of checkedValues) {
      delete c.items
    }

    emits('selected', checkedValues)
    modelValue.value = false
  }
}

// defineExpose({ inputAndSearch })
</script>
