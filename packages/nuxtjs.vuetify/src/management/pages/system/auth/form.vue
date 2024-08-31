<template>
  <UBox direction="col" style="padding: 5px">
    <UItem :ratio="1">
      <!-- <Vuelidate ref="validationGroup" class="auth-form"> -->
      <UFieldSet>
        <UFieldRow>
          <UField required label="권한사용 기간">
            <!-- <VueDatepicker v-model:start="inputData.useSrtDt" v-model:end="inputData.useEndDt" /> -->
          </UField>
        </UFieldRow>
        <UFieldRow v-show="showAuthGrpDelYn">
          <UField blank>
            <VCheckBox
              v-model="inputData.authGrpDelYn"
              :itemsSource="[
                {
                  text: '권한 설정 시, 소속 권한 그룹 삭제',
                  trueValue: 'Y',
                  falseValue: 'N',
                },
              ]"
              :width="120"
            />
          </UField>
        </UFieldRow>
        <UFieldRow>
          <UHelpBox>
            <UField label="범위 선택">
              <UVCheckGroupBox v-model="selected" :itemsSource="authScopes" />
            </UField>
          </UHelpBox>
        </UFieldRow>
        <UFieldRow>
          <UItem>
            <treeview
              :nodes="nodes"
              :config="config"
              @nodeChecked="checked"
              @nodeUnchecked="unchecked"
            >
              <template #after-input="props">
                <span class="after">
                  <auth-function-check-box
                    v-for="(fn, i) in props.node.authFncs"
                    :key="fn.fncId"
                    v-model="fn.authYn"
                    :disabled="!props.node.state.checked"
                    :text="fn.fncNm"
                    :is-first="i === 0"
                  />
                </span>
              </template>
            </treeview>
          </UItem>
        </UFieldRow>
      </UFieldSet>
      <!-- </Vuelidate> -->
    </UItem>
    <UItem>
      <UButtonBar>
        <UButtonBox>
          <VBtn text="저장" type="primary" :width="80" @click="() => save()" />
        </UButtonBox>
      </UButtonBar>
    </UItem>
  </UBox>
</template>
<script lang="ts" setup>
import {
  ref,
  reactive,
  defineExpose,
  defineProps,
  computed,
  nextTick,
} from "#moong/nuxt";
import {
  Auth,
  useUstraAuthService,
  AuthMenuTreeData,
} from "#moong/nuxt/management";
import { useDeepMerge } from "#moong/nuxt/composables";
import { useUstraCodeList } from "#moong/nuxt/management/composables";
import { LocalDataProvider } from "realgrid";
import treeview from "vue3-treeview";
import UVCheckGroupBox from "#moong/nuxt-vuetify/components/check-box/u-v-check-group-box.vue";
import AuthFunctionCheckBox from "./auth-function-check-box.vue";
import VCheckBox from "#moong/nuxt-vuetify/components/check-box/u-v-check-group-box.vue";

const authService = useUstraAuthService();
const inputData: Auth = reactive({});
// const validationGroup = shallowRef<InstanceType<typeof UValidationGroup>>()

const props = defineProps<{
  sysCd: string;
  showAuthGrpDelYn: boolean;
}>();

const ready = ref(false);
const authScopes = ref([]);
const selected = ref([]);
onMounted(() => {
  ready.value = true;
  console.log("=====>>>>> ready", ready.value);
  let codes: CodeItem[] = useUstraUtils()
    .core.deepMerge([], useUstraCodeList("AUTH_SCOP_CD"))
    .filter((code) => !props.onlyUse || code.useYn === "Y")
    .map((code) => {
      code.value = code.dtlCd;
      code.display = code.cdNm;
      code.checked = false;

      if (props.displayCode) {
        code.display = `${code.dtlCd} : ${code.cdNm}`;
      }

      return code;
    });
  codes.forEach((e) => {
    let item = { text: e.cdNm, value: e.dtlCd };
    authScopes.value.push(item);
  });
});

const nodes = ref([]);
const config = ref({ roots: [], checkboxes: true });

/**
 * 초기화
 */
function init() {
  useDeepMerge(inputData, {
    authGrpId: null,
    usrId: null,
    useSrtDt: null,
    useEndDt: null,
    menus: [],
    authGrpDelYn: "N",
  });

  Object.assign(nodes.value, []);
  Object.assign(config.value, { roots: [], checkboxes: true });

  // validationGroup.value?.init()
}
init();

/**
 * group 권한 정보 로드
 * @param authGrpId 권한 그룹 아이디
 */
async function loadOfGroup(authGrpId: number) {
  init();
  const result = await authService.getAuthGroupInfo(authGrpId, props.sysCd);
  return generateAuthData(result);
}

/**
 * 사용자 권한 정보 로드
 * @param usrId
 */
async function loadOfUser(usrId: string) {
  init();
  const result = await authService.getUserAuthInfo(usrId, props.sysCd);
  return generateAuthData(result);
}

function generateAuthData(auth: Auth) {
  $ustra.utils.model.reclusiveEach(auth.menus, "items", (m) => {
    if (m.authFncs) {
      m.functionItemsSource = m.authFncs.map((f) => {
        return {
          text: f.fncNm,
        };
      });

      m.functionValues = computed({
        get() {
          return reactive(m.authFncs.map((v) => v.authYn === "Y"));
        },
        set(v) {
          v.forEach((value, index) => {
            m.authFncs[index].authYn = value ? "Y" : "N";
          });
        },
      });
    }
  });
  useDeepMerge(inputData, auth);

  const itemIter = [];
  inputData.menus.forEach((e) => {
    itemIter.push(e);
  });

  for (let i = 0; i < itemIter.length; i++) {
    const eachItem = itemIter[i];
    eachItem.items.forEach((each) => {
      itemIter.push(each);
    });
  }

  itemIter.forEach((item) => {
    const { uprMnuId, mnuId, mnuNm, authFncs, authYn } = item;
    nodes.value[mnuId] = {
      text: mnuNm,
      children: item.items.map((each) => each.mnuId),
      authFncs: authFncs,
      state: { checked: authYn === "Y" ? true : false },
    };

    if (!uprMnuId) {
      config.value.roots.push(mnuId);
    }
  });
}

const gridAction = (function () {
  const columns = ref([
    {
      name: "mnuNm",
      fieldName: "mnuNm",
      width: "200",
      header: {
        text: "메뉴",
      },
    },
    {
      name: "functionValues",
      fieldName: "functionValues",
      width: "80",
      header: {
        text: "기능",
      },
    },
  ]);

  const fields = ref([
    {
      fieldName: "mnuNm",
      dataType: "text",
    },
    {
      fieldName: "functionValues",
      dataType: "text",
    },
  ]);

  const dataProvider = ref(new LocalDataProvider(false));
  dataProvider.value.setRows([]);

  return {
    dataProvider,
    columns,
    fields,
    ready,
  };
})();

// 저장
async function save() {
  // const validResult = await validationGroup.value.validate()

  // if (!validResult.isValid) {
  //   return
  // }

  const saveData = $ustra.utils.core.deepMerge({}, inputData);
  const menus = $ustra.utils.model.flatReclusiveArray(saveData.menus, "items");
  saveData.menus = menus
    .filter((m) => {
      // return grid.rawControl.selectedItems.some(rd => rd.mnuId === m.mnuId)

      return nodes.value.some(
        (e) => e.state.checked == true && e.id === m.mnuId
      );
    })
    .map((m) => {
      m = pick(m, ["mnuId", "authFncs", "mnuNm", "functionValues"]);
      m.authId = saveData.authId;

      if (m.authFncs) {
        m.authFncs = m.authFncs.map((authFnc, index) => {
          const newFnc = pick(authFnc, ["authId", "authYn", "fncId", "mnuId"]);

          // if (m.functionValues.value[index]) {
          //   newFnc.authYn = 'Y'
          // }

          return newFnc;
        });
      }

      return m;
    });

  const result = await authService.save(saveData);

  if (result.resultCode === "FM11") {
    // TODO: 승인 로직 처리
    return;
  }

  alert("저장이 완료되었습니다.");
}

function checked(node) {
  console.log("page checked event = ", node);
  if (node.children.length > 0) {
    nodes.value.forEach((e) => {
      if (node.id == e.parent) {
        e.state.checked = true;
      }
    });
  }
}
function unchecked(node) {
  console.log("page unchecked event = ", node);
  if (node.children.length > 0) {
    nodes.value.forEach((e) => {
      if (node.id == e.parent) {
        e.state.checked = false;
      }
    });
  }
}

defineExpose({
  init,
  loadOfGroup,
  loadOfUser,
});
</script>
<script lang="ts">
export default {
  name: "UstraManagementSystemAuthForm",
};
</script>
<style scoped>
:deep(.wj-cell.wj-group) {
  background-color: unset;
}

:deep(
    .wj-flexgrid.wj-control.wj-content
      .wj-cells
      .wj-row
      .wj-cell.wj-state-multi-selected
  ) {
  background-color: unset;
  color: #000;
}

:deep(
    .wj-flexgrid.wj-control.wj-content
      .wj-cells
      .wj-row
      .wj-cell.wj-state-selected
  ) {
  background-color: unset;
  color: #000;
}
</style>
