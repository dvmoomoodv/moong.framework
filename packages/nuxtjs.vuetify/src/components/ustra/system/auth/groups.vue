<template>
  <UBox direction="row" style="gap: 5px">
    <UItem :ratio="4">
      <treeview
        :nodes="treeActions.nodes"
        :config="treeActions.config"
        @nodeFocus="(e) => focus(e.id)"
      />
    </UItem>
    <UItem :ratio="6" :disabled="isDisabled">
      <Form :sysCd="props.systemCode" ref="form" :showAuthGrpDelYn="false" />
    </UItem>
  </UBox>
</template>
<script lang="ts" setup>
import {
  ref,
  watch,
  onMounted,
  useOnError,
  provide,
  inject,
  shallowRef,
  defineProps,
} from "#moong/nuxt";
import {
  useUstraAuthGroupService,
  AuthGroup,
  AuthGroupTreeData,
} from "#moong/nuxt/management";
import treeview from "vue3-treeview";
import Form from "./form.vue";

const authGroupService = useUstraAuthGroupService();
const form = ref<InstanceType<typeof Form>>();
const isDisabled = ref(true);

const props = defineProps<{
  /**
   * 시스템 코드
   */
  systemCode: string;
}>();

// 시스템 코드 변경
watch(
  () => props.systemCode,
  () => treeActions.loadAuthGroups(),
  {
    immediate: false,
  }
);

// // 트리 영역
const treeActions = (function () {
  const nodes = reactive({});
  // const roots = []
  const config = reactive({ roots: [] });
  // tree view object
  const treeView = ref<InstanceType<typeof treeview>>(null);

  // 현재 권한 목록
  const items = ref<AuthGroupTreeData[]>([]);

  // 선택된 권한 그룹 아이디
  let selectedAuthGrpId: number = null;

  // 권한 그룹 로드
  function loadAuthGroups(authGrpId?: number) {
    selectedAuthGrpId = authGrpId;

    Object.assign(items, []);
    Object.assign(nodes, {});
    Object.assign(config, { roots: [] });

    return useOnError(
      async function () {
        // formActions.init()
        // formActions.disabled.value = true

        items.value = await authGroupService.getAuthGroups({
          sysCd: props.systemCode.dtlCd,
        });

        const itemIter = [];
        items.value.forEach((each) => {
          itemIter.push(each);
        });

        for (let i = 0; i < itemIter.length; i++) {
          const eachItem = itemIter[i];
          eachItem.items.forEach((each) => {
            itemIter.push(each);
          });
        }

        itemIter.forEach((item) => {
          const { authGrpId, uprAuthGrpId, authGrpNm } = item;
          nodes[authGrpId] = {
            text: authGrpNm,
            children: item.items.map((each) => each.authGrpId),
            state: {},
          };

          if (!uprAuthGrpId) {
            config.roots.push(authGrpId);
          }
        });
      },
      {
        message: "권한 그룹 조회 중 오류가 발생하였습니다.",
      }
    )();
  }

  // 아이디로 권한 그룹 정보 조회
  function findAuthGroupById(authGrpId): AuthGroupTreeData {
    if (!authGrpId) {
      return;
    }

    function find(authGroups: AuthGroupTreeData[]) {
      if (!authGroups) {
        return;
      }

      for (const group of authGroups) {
        if (group.authGrpId === authGrpId) {
          return group;
        }

        const childResult = find(group.items);

        if (childResult) {
          return childResult;
        }
      }
    }

    return find(items.value);
  }

  // 최대 정렬 순번 조회
  function getMaxSrtNo(uprGrpId?: number) {
    if (!uprGrpId) {
      return Math.max(
        Math.max(...items.value.map((m) => m.srtNo)),
        items.value.length + 1
      );
    } else {
      const uprGrpInfo = $ustra.utils.model.findReclusiveItem(
        items.value,
        "items",
        (i) => i.authGrpId === uprGrpId
      );

      if (uprGrpInfo) {
        uprGrpInfo.items = uprGrpInfo.items || [];
        return Math.max(
          Math.max(...uprGrpInfo.items.map((m) => m.srtNo)),
          uprGrpInfo.items.length + 1
        );
      }
    }
  }

  // 트리 로드 완료 시
  function onLoadedItems(treeObj) {
    treeObj.collapseToLevel(0);

    if (selectedAuthGrpId) {
      const selected = findAuthGroupById(selectedAuthGrpId);
      selectedAuthGrpId = null;

      if (selected) {
        treeObj.selectedItem = selected;

        if (treeObj.selectedItem) {
          formActions.load(selected.authGrpId);
        }
      }
    }
  }

  /**
   * 메뉴의 경로 명 목록 조회
   */
  function getPathText(mnuId) {
    const pathTexts = [];

    while (true) {
      const menu = findAuthGroupById(mnuId);

      if (!menu) {
        break;
      }

      pathTexts.unshift(menu.mnuNm);
      mnuId = menu.uprMnuId;
    }

    return pathTexts;
  }

  return {
    treeView,
    items,
    loadAuthGroups,
    findAuthGroupById,
    getMaxSrtNo,
    getPathText,
    onLoadedItems,
    nodes,
    config,
  };
})();

const formActions = (function () {
  /**
   * form disabled 여부
   */
  const disabled = ref(true);

  /**
   * form component
   */
  const component = ref<InstanceType<typeof Form>>();

  // form 초기화
  function init(parentGroup: AuthGroup = null) {
    disabled.value = false;

    if (component.value.init) {
      // component.value.init(parentGroup, treeActions.getMaxSrtNo(parentGroup?.authGrpId))
      component.value.init(treeActions.getMaxSrtNo(parentGroup?.authGrpId));
    }
  }
  /**
   * 상세 조회
   * @param authGrpId 권한 그룹 아이디
   */
  async function load(authGrpId: number) {
    init();
    const comp = await $ustra.utils.core.getObjectAsync(() => component.value);
    useExposed(comp).detail(authGrpId);
  }

  return { disabled, component, init, load };
})();

function focus(authGrpId: number) {
  isDisabled.value = !authGrpId;
  !authGrpId ? form.value.init() : form.value.loadOfGroup(authGrpId);
}
</script>
