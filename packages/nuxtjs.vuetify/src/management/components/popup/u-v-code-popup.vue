<template>
  <UPopup v-model="value" title="코드 조회" :width="props.width" :height="props.height">
    <UBox direction="col">
      <UItem>
        <UButtonBar>
          <UFieldSet>
            <UFieldRow :ratio="[2, 1]">
              <UField label="코드/명" direction="col">
                <VTextField ref="keywordInput" v-model="inputValue.keyword" :initialized="e => e.focus()" @keyup.enter="search" />
              </UField>
              <UField blank>
                <UButtonBox>
                  <VBtn @click="search">검색</VBtn>
                </UButtonBox>
              </UField>
            </UFieldRow>
          </UFieldSet>
        </UButtonBar>
      </UItem>

      <UItem :ratio="1" scrollType="hidden">
        <URealGrid :columns="columns" 
                   :fields="fields" 
                   :dataProvider="dataProvider" 
                   :oncellclick="() => {
                    console.log('test')
                   }"
                   :ready="true"
                   ref="realgrid"
                   />
      </UItem>
    </UBox>

    <template #buttons>
      <VBtn type="primary" @click="() => onGridRowDblClick(grid)">적용</VBtn>
    </template>
  </UPopup>
</template>
<script lang="ts" setup>
import { defineProps, withDefaults, ref, reactive, toRaw, defineEmits, watchEffect, defineExpose, defineOptions } from '#ustra/nuxt'
import { baseModels } from '#ustra/core/data'
import { useVModel } from '@vueuse/core'
// import { addWjGridEventHandler } from '#ustra/nuxt-wijmo/composables'
import { useUstraCodeService } from '#ustra/nuxt/management/services/code'
import URealGrid from '#ustra/nuxt-vuetify/components/real-grid/u-real-grid.vue'
import { LocalDataProvider } from 'realgrid'

const columns = ref([
      {
        name: 'node',
        fieldName: 'code',
        width: '80',
        header: {
          text: '코드',
        },
      },
      {
        name: 'name',
        fieldName: 'name',
        width: '80',
        header: {
          text: '명',
        },
      },
    ])

const fields = ref([
      {
        fieldName: 'code',
        dataType: 'text',
      },
      {
        fieldName: 'name',
        dataType: 'text',
      },
    ])

const realgrid = ref(null)
const gridView = ref(null)
const dataProvider = ref(new LocalDataProvider(false))

onMounted(async () => {
  await nextTick()

  const gridView1 = realgrid.value.gridView
  const dataProvider1 = realgrid.value.dataProvider


  // const { gridView1, dataProvider1 } = realgrid.value.initRG(
  //   [
  //     {
  //       fieldName: 'code',
  //       dataType: 'text',
  //     },
  //     {
  //       fieldName: 'name',
  //       dataType: 'text',
  //     },
  //   ],
  //   [
  //     {
  //       name: 'node',
  //       fieldName: 'code',
  //       width: '80',
  //       header: {
  //         text: '코드',
  //       },
  //     },
  //     {
  //       name: 'name',
  //       fieldName: 'name',
  //       width: '80',
  //       header: {
  //         text: '명',
  //       },
  //     },
  //   ],
  //   [],
  //   {},
  // )

  // gridView.value = gridView1
  // dataProvider.value = dataProvider1
})

// prop & values
const props = withDefaults(
  defineProps<{
    /**
     * 그룹 코드
     */
    grpCd: string

    /**
     * 넓이
     */
    width?: string | number

    /**
     * 높이
     */
    height?: string | number

    /**
     * 오픈 시 자동 조회
     */
    searchOnOopen?: boolean

    /**
     * 팝업 오픈 여부
     */
    modelValue: boolean
  }>(),
  {
    modelValue: false,
    width: 800,
    height: 700,
    searchOnOopen: true,
  },
)
const value = useVModel(props, 'modelValue')

// for input
const inputValue = reactive({
  keyword: null,
})

const keywordInput = ref()

// grid data
const itemsSource = ref<baseModels.CodeNameModel[]>([])
async function search() {
  const { getCodesByGroup } = useUstraCodeService()
  itemsSource.value = (await getCodesByGroup(props.grpCd))
    // .filter(c => {
    //   if (!inputValue.keyword) {
    //     return true
    //   }

    //   return (
    //     (c.dtlCd && c.dtlCd.toLocaleLowerCase().includes(inputValue.keyword.toLocaleLowerCase())) ||
    //     (c.cdNm && c.cdNm.toLocaleLowerCase().includes(inputValue.keyword.toLocaleLowerCase()))
    //   )
    // })
    .map(c => {
      return {
        code: c.dtlCd,
        name: c.cdNm,
      }
    })
  console.log('itemSource', itemsSource)
  if (dataProvider.value) {
    dataProvider.value.fillJsonData(itemsSource.value, { fillMode: 'set' })
  }
}

const activeInfo = ref(null) // Cell active info
const activeData = ref(null) // Cell active data

watchEffect(async () => {
  if (value.value) {
    itemsSource.value = []
  }
})

// grid action
const emits = defineEmits<{
  (e: 'selected', item: baseModels.CodeNameModel): void
  (e: 'update:modelValue', v: boolean): void
}>()
const grid = ref()
function onGridRowDblClick(grid, col?, row?) {
  if (grid.selectedRows.length > 0) {
    emits('selected', toRaw(grid.selectedRows[0].dataItem))
    value.value = false
  }
}

// button
const disabledButton = ref(true)

/**
 * input keyword and search
 * @param keyword
 */
async function inputAndSearch(keyword: string) {
  inputValue.keyword = keyword

  if (keyword || props.searchOnOopen) {
    await search()

    if (itemsSource.value.length === 1) {
      emits('selected', toRaw(grid.value.selectedRows[0].dataItem))
      value.value = false
    }
  }
}

defineExpose({ inputAndSearch })
</script>
<script lang="ts">
export default {
  name: 'UVCodePopup',
}
</script>
