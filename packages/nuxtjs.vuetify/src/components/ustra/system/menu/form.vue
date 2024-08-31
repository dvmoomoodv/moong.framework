<template>
    <UBox>
        <UItem>
            <VTabs v-model="tab">
                <VTab value="tab1">메뉴 정보</VTab>
                <VTab value="tab2">권한 정보</VTab>
            </VTabs>
            <VWindow v-model="tab">
                <VWindowItem value = 'tab1'>
                    <UBox direction="col">
                        <UItem :ratio="1">
                            <UFieldSet ref="fieldSet">
                                <UFieldRow v-show="!!uprMenuData">
                                    <UField label="상위 메뉴 명">
                                        {{ uprPathText }}
                                    </UField>
                                </UFieldRow>
                                <UFieldRow>
                                    <UField v-show="mode === 'update'" label="메뉴 ID">
                                        {{ inputData.mnuId }}
                                    </UField>
                                </UFieldRow>
                                <UFieldRow>
                                    <UField label="프로그램 ID">
                                        <VTextField v-model="inputData.proIdVal" v-byte-length="20" />
                                    </UField>
                                </UFieldRow>
                                <UFieldRow>
                                    <UField label="메뉴 명">
                                        <VTextField v-model="inputData.mnuNm" v-byte-length="50" />
                                    </UField>
                                </UFieldRow>
                                <UFieldRow>
                                    <UField label="메뉴 설명">
                                        <VTextField v-model="inputData.mnuDesc" v-byte-length="1000" />
                                    </UField>
                                </UFieldRow>
                                <UFieldRow>
                                    <UField label="URL">
                                        <VTextField v-model="inputData.mnuUrl" v-byte-length="1000" />
                                    </UField>
                                </UFieldRow>
                                <UFieldRow>
                                    <UField label="메뉴 순번">
                                        <VTextField v-model="inputData.mnuSrtNo" />
                                    </UField>
                                </UFieldRow>
                                <UFieldRow>
                                    <UField label="메뉴 유형" :width="150">
                                        <UVCodeComboBox grpCd="MNU_TY_CD" v-model="inputData.mnuTyCd"/>
                                    </UField>
                                    <UField label="권한 범위" :width="150">
                                        <UVCodeComboBox grpCd="AUTH_SCOP_CD" v-model="inputData.authScopCd"/>
                                    </UField>
                                </UFieldRow>
                                <UFieldRow>
                                    <UField label="사용여부">
                                        <UVRadioGroupBox v-model="inputData.useYn" :itemsSource="useYnList" display-expr="name" value-expr="code" />
                                    </UField>
                                </UFieldRow>
                                <UFieldRow>
                                    <UField label=" ">
                                        <VCheckBox v-model="inputData.dpYn" :items-source="[{ trueValue: 'Y', falseValue: 'N', text: '메뉴 노출' }]" :width="120" />
                                        <!-- <VCheckBox v-show="isPersonalInfoSystem" v-model="inputData.prvViewYn" text="개인정보 조회 기능 포함" :width="200" /> -->
                                        <VCheckBox v-model="inputData.prvViewYn" :items-source="[{ trueValue: 'Y', falseValue: 'N', text: '개인정보 조회 기능 포함' }]" :width="200" />
                                        <VCheckBox v-model="inputData.ipLmtYn" :items-source="[{ trueValue: 'Y', falseValue: 'N', text: '아이피 제한' }]"  :width="120" />
                                    </UField>
                                </UFieldRow>
                                <UFieldRow v-show="inputData.ipLmtYn === 'Y'">
                                    <UField label="아이피 목록">
                                        <VTextField v-model="ipListData" />
                                    </UField>
                                </UFieldRow>
                                <UFieldRow v-show="inputData.mnuTyCd === '02'">
                                    <UField label="">
                                        menufunctionform
                                    </UField>
                                </UFieldRow>
                                <UFieldRow>
                                    <UField label="메뉴 아이콘">
                                        <!-- <UVSingleFileUploader
                                            ref="fileupload"
                                            v-model="uploadResult"
                                            converted-file-type="image"
                                            :height="150"
                                            :editable="true"
                                            :deletable="true"
                                        /> -->
                                    </UField>
                                </UFieldRow>
                                <UFieldRow v-show="mode === 'update'">
                                    <UField label="입력 정보">
                                        <USystemInfoBox :model="inputData" />
                                    </UField>
                                </UFieldRow>
                                <UFieldRow v-show="mode === 'update'">
                                    <UField label="수정 정보">
                                        <USystemInfoBox :model="inputData" />
                                    </UField>
                                </UFieldRow>
                            </UFieldSet>
                        </UItem>
                        <UItem>
                            <UButtonBar>
                                <VBtn text="저장" type="primary" class="right" @click="saveForm" />
                                <VBtn text="삭제" :disabled="mode === 'new'" @click="removeForm" />
                            </UButtonBar>
                        </UItem>
                    </UBox>
                </VWindowItem>
                <VWindowItem value="tab2">
                    <UBox direction="col">
                        <UItem :ratio="1">
                            <UBox direction="col">
                                <UItem>
                                    <UHelpBox>접근 가능 권한 그룹</UHelpBox>
                                </UItem>
                                <UItem :ratio="1">
                                        <URealGrid :columns="groupGrid.columns.value"
                                                    :fields="groupGrid.fields.value"
                                                    :dataProvider="groupGrid.dataProvider.value"
                                                    :ready="groupGrid.ready.value"
                                        />
                                </UItem>
                            </UBox>
                        </UItem>
                        <UItem :ratio="1">
                            <UBox direction="col">
                                <UItem>
                                    <UHelpBox>접근 가능 사용자</UHelpBox>
                                </UItem>
                                <UItem :ratio="1">
                                    <URealGrid :columns="userGrid.columns.value"
                                                :fields="userGrid.fields.value"
                                                :dataProvider="userGrid.dataProvider.value"
                                                :ready="userGrid.ready.value"
                                    />
                                </UItem>
                            </UBox>
                        </UItem>
                    </UBox>
                </VWindowItem>
            </VWindow>
        </UItem>
    </UBox>
</template>
<script lang="ts" setup>
import { LocalDataProvider } from 'realgrid'
import { Menu, MenuPathText } from '@ustra/nuxt-mng/src/system/models/menu-model'
import URealGrid from '#ustra/nuxt-vuetify/components/real-grid/u-real-grid.vue'
import { AuthGroup, useUstraMenuService, useUstraAuthGroupService, useUstraAuthService, useUstraManagementUser } from '#ustra/nuxt/management'
import { computed, reactive, ref, shallowRef, defineExpose } from '#ustra/nuxt'
import UVCodeComboBox from '#ustra/nuxt-vuetify/management/components/combo-box/u-v-code-combo-box.vue'
import UVRadioGroupBox from '#ustra/nuxt-vuetify/components/radio/u-v-radio-group-box.vue'
import VCheckBox from '#ustra/nuxt-vuetify/components/check-box/u-v-check-group-box.vue'


const authGroupService = useUstraAuthGroupService()
const ustraAuthService = useUstraAuthService()
const ustraMenuService = useUstraMenuService()

const ready = ref(false)

const props = defineProps<{
  sysCd: string,
}>()

onMounted(() => {
  ready.value = true
  console.log('=====>>>>> menu form ready', ready.value)
  init()
})

const emits = defineEmits<{
  (e: 'reload'): void
}>()

const tab = ref('tab1')

watch(tab, t => {
    if(tab.value === 'tab2' && inputData.mnuId != null){
        bindAuthDetail(inputData.mnuId)
    }
})

const ipListData = computed(() => 
    inputData.ipList ? inputData.ipList.split(',') : []
)

const selectedMnuTyCd = ref<string>(null)
const selectedaAuthScopCd = ref<string>(null)

const inputData: MenuData = reactive({
    mnuId: null,
    uprMnuId: null,
    proIdVal: null,
    mnuNm: null,
    mnuSrtNo: 1,
    mnuUrl: null,
    mnuDesc: null,
    mnuTyCd: selectedMnuTyCd,
    mnuStepNo: 1,
    useYn: 'Y',
    delYn: 'N',
    functions: [],
    sysCd : props.sysCd,
    iconFileId: null,
    ipLmtYn: 'N',
    ipList: null,
    prvViewYn: 'N',
    dpYn: 'Y',
    authScopCd: selectedaAuthScopCd,
    accessibleAuthGroups: [],
    accessibleUsers: [],
})

function init(uprMenu){
    useDeepMerge(inputData, {
        mnuId: null,
        uprMnuId: uprMenu ? uprMenu.mnuId : null,
        proIdVal: null,
        mnuNm: null,
        mnuSrtNo: 1,
        mnuUrl: null,
        mnuDesc: null,
        mnuTyCd: '01',
        mnuStepNo: uprMenu ? uprMenu.mnuStepNo + 1 : 1,
        useYn: 'Y',
        delYn: 'N',
        functions: [],
        sysCd : props.sysCd,
        iconFileId: null,
        ipLmtYn: 'N',
        ipList: null,
        prvViewYn: 'N',
        dpYn: 'Y',
        authScopCd: '99',
        accessibleAuthGroups: [],
        accessibleUsers: [],
    })
    mode.value = 'new'
}
      
    
const uprMenuData: MenuPathText = ref(null)

const useYnList = reactive([
    { value: 'Y', text: '사용' },
    { value: 'N', text: '미사용' },
])

const mode = ref('new')
const uploadResult = {fileId:null}

// const isPersonalInfoSystem = $ustra.bo.store.cmData.appProp.isPersonalInfoSystem

const bindDetail = function (menu: MenuPathText) {
  useOnError(
    async () => {

        mode.value = 'update'
        useDeepMerge(inputData, menu)

        console.log('selected============>', inputData)

        if(menu.uprMnuId){
            uprMenuData.value = {
                pathText: menu.uprMnuNm,
                mnuId: menu.uprMnuId
            }
        }
    },
    {
      message: '상세 정보 조회 중 오류가 발생하였습니다.',
    },
  )()
}

const bindAuthDetail = function (mnuId) {
  useOnError(
    async () => {

        const result = await ustraMenuService.getMenu(mnuId)

        groupGrid.dataProvider.value.setRows(result.accessibleAuthGroups)
        userGrid.dataProvider.value.setRows(result.accessibleUsers)

    },
    {
      message: '상세 정보 조회 중 오류가 발생하였습니다.',
    },
  )()
}

function getPathText(mnuId) {
    const pathTexts = []

    while (true) {
      const menu = findAuthGroupById(mnuId)

      if (!menu) {
        break
      }

      pathTexts.unshift(menu.mnuNm)
      mnuId = menu.uprMnuId
    }

    return pathTexts
  }

async function saveForm(){
    const saveData = $ustra.utils.core.deepMerge({}, inputData)
    saveData.mnuTyCd = inputData.mnuTyCd.dtlCd
    saveData.authScopCd = inputData.authScopCd.dtlCd
    if (mode === 'new') {
        const result = await ustraMenuService.addMenu(saveData)
        if (result.resultCode === 'FM11') {
            // TODO: 승인 로직 처리
            return
        }
        alert('저장이 완료되었습니다.')
        emits('reload')

    } else {
        const result = await ustraMenuService.updateMenu(saveData)
        if (result.resultCode === 'FM11') {            
            // TODO: 승인 로직 처리
            return
        }
      
        alert('저장이 완료되었습니다.')
        emits('reload')
    }
}

async function removeForm(){
    const result = await confirm('삭제하시겠습니까?')

    if (!result) {
        return
    }

    await ustraMenuService.removeMenu(inputData)
    init()
}

const groupGrid = (function () {
    const columns = ref([
        {
            name: 'authGrpId',
            fieldName: 'authGrpId',
            width: '80',
            header: {
            text: '아이디',
            },
        },
        {
            name: 'authGrpNm',
            fieldName: 'authGrpNm',
            width: '80',
            header: {
            text: '그룹명',
            },
        },
        {
            name: 'useSrtDt',
            fieldName: 'useSrtDt',
            width: '80',
            header: {
            text: '시작일',
            },
        },
        {
            name: 'useEndDt',
            fieldName: 'useEndDt',
            width: '80',
            header: {
            text: '종료일',
            },
        },
        ])

    const fields = ref([
        {
            fieldName: 'authGrpId',
            dataType: 'text',
        },
        {
            fieldName: 'authGrpNm',
            dataType: 'text',
        },
        {
            fieldName: 'useSrtDt',
            dataType: 'text',
        },
        {
            fieldName: 'useEndDt',
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

const userGrid = (function () {
    const columns = ref([
        {
            name: 'usrId',
            fieldName: 'usrId',
            width: '80',
            header: {
            text: '사용자아이디',
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
            text: '사용구분',
            },
        },
        {
            name: 'useSrtDt',
            fieldName: 'useSrtDt',
            width: '80',
            header: {
            text: '시작일',
            },
        },
        {
            name: 'useEndDt',
            fieldName: 'useEndDt',
            width: '80',
            header: {
            text: '종료일',
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
        {
            fieldName: 'useSrtDt',
            dataType: 'text',
        },
        {
            fieldName: 'useEndDt',
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

defineExpose({ init, bindDetail, bindAuthDetail })
</script>