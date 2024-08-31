<template>
    <UFieldSet label="소속 사용자">
        <UFieldRow>
            <UButtonBar class="mt-2">
      <UButtonBox right>
            <VBtn icon="mdi-plus" @click="showUserPopup = true"></VBtn>
            <VBtn icon="mdi-minus" :disabled="gridAction.dataProvider.rowCount < 1"></VBtn>
        </UButtonBox>
    </UButtonBar>
    </UFieldRow>
    <UFieldRow>
    <URealGrid :columns="gridAction.columns.value"
                :fields="gridAction.fields.value"
                :dataProvider="gridAction.dataProvider.value"
                :ready="gridAction.ready.value"
        />
    </UFieldRow>
    <UserPopup v-model="showUserPopup" :multiple="true" @selected="addUsers" />
</UFieldSet>
</template>
<script lang="ts" setup>
import { ref, defineProps, watch } from '#ustra/nuxt'
import { useUstraCodeValue, useUstraUserDeptName, User } from '#ustra/nuxt/management'
import UserPopup from '#ustra/nuxt-vuetify/management/components/popup/u-v-user-popup.vue'
import { LocalDataProvider } from 'realgrid'
import URealGrid from '#ustra/nuxt-vuetify/components/real-grid/u-real-grid.vue'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: User[]
}>()

const modelValue = useVModel(props, 'modelValue')
watch(
  modelValue,
  () => {
    gridAction.dataProvider.value.setRows(modelValue.value)
  },
  { deep: true },
)
const ready = ref(false)
onMounted(() => {
  ready.value = true
  console.log('=====>>>>> ready', ready.value)
})

const gridAction = (function () {
    const columns = ref([
        {
            name: 'usrId',
            fieldName: 'usrId',
            width: '80',
            header: {
            text: '사용자ID',
            },
        },
        {
            name: 'usrNm',
            fieldName: 'usrNm',
            width: '80',
            header: {
            text: '사용자이름',
            },
        },
        {
            name: 'orgCd',
            fieldName: 'orgCd',
            width: '80',
            header: {
            text: '회사명',
            },
        },
        {
            name: 'deptCd',
            fieldName: 'deptCd',
            width: '80',
            header: {
            text: '부서명',
            },
        },
        {
            name: 'usrSttCd',
            fieldName: 'usrSttCd',
            width: '80',
            header: {
            text: '상태',
            },
        },
        {
            name: 'useDvCd',
            fieldName: 'useDvCd',
            width: '80',
            header: {
            text: '구분',
            },
        },
        ])

    const fields = ref([
        {
            fieldName: 'usrId',
            dataType: 'text',
        },
        {
            fieldName: 'usrNm',
            dataType: 'text',
        },
        {
            fieldName: 'orgCd',
            dataType: 'text',
        },
        {
            fieldName: 'deptCd',
            dataType: 'text',
        },
        {
            fieldName: 'usrSttCd',
            dataType: 'text',
        },
        {
            fieldName: 'useDvCd',
            dataType: 'text',
        },
    ])

    const dataProvider = ref(new LocalDataProvider(false))
    dataProvider.value.setRows([])

    return {
        dataProvider,
        columns,
        fields,
        ready,
    }
})()

const showUserPopup = ref(false)

function addUsers(users: User[]) {
  const targetUsers = users.filter(user => {
    return !modelValue.value.some(ou => ou.usrId === user.usrId)
  })
  modelValue.value.push(...targetUsers)
  grid.collectionView?.refresh()
}
</script>
<script lang="ts">
export default {
name: 'UstraManagementSystemAuthGroupUsers',
}
</script>
  