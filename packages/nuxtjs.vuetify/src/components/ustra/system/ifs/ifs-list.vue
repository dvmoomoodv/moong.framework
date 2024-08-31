<template>
  <URealGrid :columns="GridAction.columns.value"
             :fields="GridAction.fields.value"
             :dataProvider="GridAction.dataProvider.value"
             :ready="GridAction.ready.value"
             :onCellClick="select"
  />
</template>

<script setup lang="ts">
import { reactive, ref, shallowRef, onBeforeMount, useDeepMerge, useOnError, computed, watch, onMounted } from '#ustra/nuxt'
import { IfsCriteria, Ifs } from '#ustra/nuxt/management'
import { useUstraInterfaceService } from '#ustra/nuxt/management/services/interface'
import URealGrid from '#ustra/nuxt-vuetify/components/real-grid/u-real-grid.vue'
import { LocalDataProvider } from 'realgrid'

const infService = useUstraInterfaceService()

const columns = ref([
{
    name: 'ifId',
    fieldName: 'ifId',
    width: '80',
    header: {
      text: 'I/F 아이디',
    },
  },
  {
    name: 'ifVer',
    fieldName: 'ifVer',
    width: '80',
    header: {
      text: 'I/F 버전',
    },
  },
  {
    name: 'ifNm',
    fieldName: 'ifNm',
    width: '80',
    header: {
      text: 'I/F명',
    },
  },
  {
    name: 'url',
    fieldName: 'url',
    width: '80',
    header: {
      text: 'URL',
    },
  },
  {
    name: 'useYn',
    fieldName: 'useYn',
    width: '80',
    header: {
      text: '사용여부',
    },
  },
])

const fields = ref([
{
    fieldName: 'ifId',
    dataType: 'text',
  },
  {
    fieldName: 'ifVer',
    dataType: 'text',
  },
  {
    fieldName: 'ifNm',
    dataType: 'text',
  },
  {
    fieldName: 'url',
    dataType: 'text',
  },
  {
    fieldName: 'useYn',
    dataType: 'text',
  },
])
const ready = ref(false)
const dataProvider = ref(new LocalDataProvider(false))

onMounted(() => {
  ready.value = true
})

const GridAction = {
  columns,
  fields,
  ready,
  dataProvider,
}

const ifs = ref<Ifs[]>([])

async function loadData(criteria) {
  const list = await infService.getInterfaces({})
  // const list = await infService.getInterfaces(criteria)
  ifs.value = list

  dataProvider.value.setRows(ifs.value)
}

function clearSelection() {
  console.log('clearSelection')
  //this.grid.instance.clearSelection()
}

// const grid = useWijmoFlexGrid<Ifs>({
//   autoSelection: false,
//   onCellClick: function (col, row, data) {
//     select(data as Ifs)
//   },
// })

const emits = defineEmits<{
  (e: 'select', ifs?: Ifs): void
}>()

function select(grid, clickData) {
  const itemIndex = clickData.itemIndex
  const data = dataProvider.value.getJsonRows()[itemIndex]

  // ifs: Ifs
  emits('select', data)
}

defineExpose({
  loadData,
  clearSelection,
})
</script>

<style scoped></style>
