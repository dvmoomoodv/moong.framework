<template>
  <UBox>
    <UItem>
      <UFieldSet>
        <UFieldRow>
          <UField label="사용자 아이디/명" :totalWidth="300">
            <VTextField maska v-model="searchActions.criteria.usrId" />
          </UField>
          <UField label="상태" :totalWidth="300">
            <UVCodeComboBox grpCd="USR_STT_CD" v-model="usrSttCd" displayNullText="전체" />
          </UField>
          <UField blank>
            <VCheckBox
              v-model="searchActions.criteria.authGrpNoneYn"
              :itemsSource="[{ text: '소속 그룹 없는 사용자', trueValue: 'Y', falseValue: 'N' }]"
            />
          </UField>
          <UButtonBox right top>
            <VBtn text="검색" type="primary" :width="80" @click="() => listActions.load()" />
          </UButtonBox>
        </UFieldRow>
      </UFieldSet>
    </UItem>
    <UItem>
      <UBox direction="row" style="gap: 5px">
        <UItem :ratio="4">
          <UBox direction="col">
            <UItem>
              <URealGrid :columns="gridAction.columns.value"
                        :fields="gridAction.fields.value"
                        :dataProvider="gridAction.dataProvider.value"
                        :ready="gridAction.ready.value"
                        :onCellClick="onCellClick"
                />
            </UItem>
          </UBox>
        </UItem>
        <UItem :ratio="6" :disabled="isDisabled">
          <Form :sysCd="props.systemCode" ref="form" :showAuthGrpDelYn="true"/>
        </UItem>
      </UBox>
    </UItem>
  </UBox>
</template>
<script lang="ts" setup>
import { ref, reactive, inject, defineProps, watch } from '#ustra/nuxt'
import { UserCriteria, User, useUstraCodeValue, useUstraUserDeptName, useUstraUserService } from '#ustra/nuxt/management'
import { LocalDataProvider } from 'realgrid'
import UVCodeComboBox from '#ustra/nuxt-vuetify/management/components/combo-box/u-v-code-combo-box.vue'
import VCheckBox from '#ustra/nuxt-vuetify/components/check-box/u-v-check-group-box.vue'
import Form from './form.vue'
import URealGrid from '#ustra/nuxt-vuetify/components/real-grid/u-real-grid.vue'

const userService = useUstraUserService()
const form = ref<InstanceType<typeof Form>>()
const isDisabled = ref(true)

const props = defineProps<{
  /**
   * 시스템 코드
   */
  systemCode: string
}>()
const ready = ref(false)
onMounted(() => {
  ready.value = true
  console.log('=====>>>>> ready', ready.value)
})

const searchActions = (() => {
  const criteria: UserCriteria = reactive({
    usrId: null,
    usrSttCd: null,
    authGrpNoneYn: 'Y',
    showAuthNoneGrp: true,
  })

  return { criteria }
})()

const gridAction = (function () {

  const columns = ref([
    {
      name: 'authGrp',
      fieldName: 'authGrp',
      width: '80',
      header: {
        text: '소속 그룹',
      },
    },
    {
      name: 'usrId',
      fieldName: 'usrId',
      width: '80',
      header: {
        text: '아이디',
      },
    },
    {
      name: 'usrNm',
      fieldName: 'usrNm',
      width: '80',
      header: {
        text: '이름',
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
    {
      name: 'apvCmplYn',
      fieldName: 'apvCmplYn',
      width: '80',
      header: {
        text: '승인완료',
      },
    },
    {
      name: 'regDttm',
      fieldName: 'regDttm',
      width: '80',
      header: {
        text: '등록일',
      },
    },
  ])

  const fields = ref([
    {
      fieldName: 'authGrp',
      dataType: 'text',
    },
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
    {
      fieldName: 'apvCmplYn',
      dataType: 'text',
    },
    {
      fieldName: 'regDttm',
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

const usrSttCd = ref(null)
const listActions = (() => {
  const users = ref<User[]>([])

  async function load() {
    searchActions.criteria.usrSttCd = usrSttCd.value
    console.log('====================>>usrSttCd', usrSttCd.value)
    console.log('====================>>criteria', searchActions.criteria)
    users.value = (await userService.getUsers(searchActions.criteria)).filter(user => user.apvCmplYn === 'Y')
    gridAction.dataProvider.value.setRows(users.value)
  }
  return { load, users }
})()

function onCellClick(grid, clickData){
  if (!clickData) {
      form.value.init()
    } else {
      form.value.loadOfUser((clickData as User).usrId)
    }
    isDisabled.value = !clickData
}
</script>
<script lang="ts">
export default {
  name: 'UstraManagementSystemAuthGrp',
}

/**
 * 경로 조회 function 사용
 */
export const usePathText = () => {
  return inject<(authGrpId: number) => string[]>('tree:getPathText')
}
</script>
