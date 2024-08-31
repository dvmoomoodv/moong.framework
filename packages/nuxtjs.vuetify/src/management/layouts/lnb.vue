<template>
  <v-navigation-drawer :rail="modelValue" permanent class="elevation-3">
    <!-- v-show="!searchMode" -->
    <v-list id="lnb" :class="{ collapse: !isOpenSideMenu }">
      <LnbItem
        v-if="!isOpenSideMenu"
        :navigations="displayNavigations"
        :navigationSelected="onNavigationSelected"
      />
    </v-list>

    <hr />
  </v-navigation-drawer>
</template>
<script lang="ts" setup>
import {
  ref,
  computed,
  defineProps,
  watch,
  PropType,
  markRaw,
} from "#moong/nuxt";
import { useVModel } from "@vueuse/core";
import { useUstraLayoutManagementSideMenu } from "#moong/nuxt/management/composables";
import { Navigation } from "#moong/nuxt/management/store/models/navigation";
import LnbItem from "./lnb-item.vue";
const props = defineProps({
  /**
   * side menu open 여부
   */
  modelValue: Boolean,

  /**
   * 메뉴 선택 시 callback function
   */
  navigationSelected: Function as PropType<
    (nav: Navigation) => void | Promise<void>
  >,
});
const model = useVModel(props, "modelValue");
const { isOpenSideMenu, navigations } = useUstraLayoutManagementSideMenu();

const displayNavigations = computed(() => {
  return navigations.value.filter((nav) => {
    return nav.visible && nav.ijd !== "home";
  });
});

watch(isOpenSideMenu, (v) => (model.value = v), { immediate: true });
watch(model, (v) => (isOpenSideMenu.value = v));

function onNavigationSelected(nav: Navigation) {
  // clear active state with path
  function clearActive(navs: Navigation[]) {
    if (!navs) {
      return;
    }

    for (const nav of navs) {
      if (nav.path) {
        nav.active = false;
      }

      clearActive(nav.items);
    }
  }

  if (nav?.path) {
    clearActive(navigations.value);
  }

  props.navigationSelected(nav);
}
</script>
