<template>
  <UBox height="100%" width="100%" direction="row">
    <UItem :ratio="1">
      <treeview :nodes="nodes" :config="config" @nodeFocus="(e) => focus(e)" />
      <UItem>
        <UButtonBar>
          <UButtonBox>
            <VBtn
              text="메뉴 추가"
              v-if="selectedMnuId == null"
              :width="100"
              @click="() => init()"
            />
            <VBtn
              text="하위 메뉴 추가"
              v-if="selectedMnuId != null"
              :width="140"
              @click="() => init(selectedMnuId)"
            />
          </UButtonBox>
        </UButtonBar>
      </UItem>
    </UItem>
  </UBox>
</template>
<script lang="ts" setup>
import treeview from "vue3-treeview";
import { useUstraMenuService } from "#moong/nuxt/management";

const ustraMenuService = useUstraMenuService();
const props = defineProps<{
  sysCd: string;
}>();

const emits = defineEmits<{
  (e: "focus", mnuId): void;
  (e: "init", menu): void;
}>();

watch(
  () => props.sysCd,
  (sysCd) => load()
);

const nodes = ref([]);
const config = ref({ roots: [] });
// const maxDepth = $ustra.bo.store.cmData.appProp.maximumMenuDepth

async function load() {
  const menus = await ustraMenuService.getMenus({ sysCd: props.sysCd }, 99);
  const itemIter = [];
  menus.forEach((e) => {
    itemIter.push(e);
  });

  for (let i = 0; i < itemIter.length; i++) {
    const eachItem = itemIter[i];
    eachItem.items.forEach((each) => {
      itemIter.push(each);
    });
  }

  itemIter.forEach((item) => {
    const {
      uprMnuId,
      mnuId,
      mnuNm,
      delYn,
      dpYn,
      ipLmtYn,
      mnuDesc,
      mnuDvcScopCd,
      mnuStrNo,
      mnuStepNo,
      mnuTyCd,
      prvViewYn,
      sysCd,
      useYn,
      mnuUrl,
    } = item;
    nodes.value[mnuId] = {
      text: mnuNm,
      delYn: delYn,
      dpYn: dpYn,
      ipLmtYn: ipLmtYn,
      mnuDesc: mnuDesc,
      mnuDvcScopCd: mnuDvcScopCd,
      mnuStrNo: mnuStrNo,
      mnuStepNo: mnuStepNo,
      mnuTyCd: mnuTyCd,
      prvViewYn: prvViewYn,
      sysCd: sysCd,
      useYn: useYn,
      mnuId: mnuId,
      mnuNm: mnuNm,
      mnuUrl: mnuUrl,
      uprMnuId: uprMnuId,
      uprMnuNm: null,
      children: [],
    };

    if (uprMnuId) {
      nodes.value[uprMnuId].children.push(mnuId);
      nodes.value[mnuId].uprMnuNm = nodes.value[uprMnuId].mnuNm;
    }

    if (!uprMnuId) {
      config.value.roots.push(mnuId);
    }
  });
}

const selectedMnuId: number = ref(null);

function focus(menu: MenuPathText) {
  emits("focus", menu);
  selectedMnuId.value = menu.mnuId;
  console.log("selected Id ===========>", selectedMnuId.value);
}

function init(menu: MenuPathText) {
  emits("init", menu);
}

defineExpose({ load });
</script>
