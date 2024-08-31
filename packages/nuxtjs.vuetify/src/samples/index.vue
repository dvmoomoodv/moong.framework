<template>
  <v-app id="sample" dark>
    <v-app-bar app color="rgb(0 97 171)" density="compact">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="white"></v-app-bar-nav-icon>
      <v-toolbar-title>USTRA Framework 3.0 Vuetify Sample</v-toolbar-title>
    </v-app-bar>

    <VNavigationDrawer v-model="drawer" app :width="350" density="compact" theme="dark">
      <VList density="compact" v-model:opened="opendMenus" v-model:selected="selectedMenus">
        <ListItems :menus="menus" />
      </VList>
    </VNavigationDrawer>
    <VMain>
      <VContainer>
        <div class="container-fluid ustra-samples">
          <NuxtPage />
        </div>
      </VContainer>
    </VMain>

    <VFooter color="#003156" app>
      <v-spacer></v-spacer>
      <span style="color: white">&copy; GSITM since 2020-{{ $ustra.utils.date.format(new Date(), 'yyyy') }}</span>
    </VFooter>
  </v-app>
</template>
<script lang="ts" setup>
import { useRouter, useHead, useRoute } from '#app'
import { ref, onMounted, useUstraEnv, computed } from '#ustra/nuxt'
import { useWindowSize } from '@vueuse/core'
import sampleMenus from './_data/sample-menu'
import managementSampleMenus from './_data/management-sample-menu'

import ListItems from './list-items.vue'

const drawer = ref(true)
const { width, height } = useWindowSize()

onMounted(() => {
  /**
   * 화면 이동 후 drawer 닫기
   * window size 960px 미만 일때 화면가림.
   */
  if (width.value < 960) drawer.value = false
})

const menus = computed(() => {
  const menus = $ustra.utils.core.deepMerge([], sampleMenus)

  if (useUstraEnv().appProps.nuxt.management.enabled) {
    menus.push(...managementSampleMenus)
  }

  if (useUstraEnv().appProps.nuxt.vuetify.samples.additionalMenus) {
    const additionalMenus = $ustra.utils.core.deepMergeArrayConcat([], useUstraEnv().appProps.nuxt.vuetify.samples.additionalMenus)
    additionalMenus.forEach(element => {
      menus.push(element)
    })
  }

  $ustra.utils.model.reclusiveEach(menus, 'items', (menu, parents) => {
    menu.selected = false
    menu.visible = $ustra.utils.core.defaults(menu.visible, true)

    if (typeof menu.visible === 'function') {
      menu.visible = menu.visible($ustra.env.appProps)
    }

    menu.items = menu.items || []

    if (parents && menu.updated && menu.visible) {
      parents.forEach(p => (p.updated = true))
    }

    menu._fullTitle = menu.title
    if (parents) {
      parents.reverse().forEach(p => (menu._fullTitle = p.title + ' / ' + menu._fullTitle))
    }
  })

  $ustra.utils.model.reclusiveEach(menus, 'items', menu => {
    menu.items = menu.items.filter(item => item.visible)
  })

  return menus
})

const pageKey = computed(() => {
  return useRoute().fullPath
})

const definePageMeta = (arg: any) => {}
definePageMeta({
  layout: false,
  auth: {
    required: false,
  },
})

useHead({
  bodyAttrs: {
    class: 'ustra samples',
  },
})

//#region 메뉴 오픈, 선택 처리

const opendMenus = ref([])
const selectedMenus = ref([])

const route = useRoute()
onMounted(() => {
  // 로드 시 선택 경로 오픈, 선택
  const routePath = $ustra.router.withoutTrailingSlashPath(route.path)
  let selectedMenu = $ustra.utils.model.flatReclusiveArray(menus.value, 'items', false, true).find(item => {
    if (!item.path) {
      return false
    }

    const path = $ustra.utils.path.withoutExt($ustra.utils.path.join(useUstraEnv().appProps.nuxt.vuetify.samples.path, item.path.replace(/\//g, '-')))
    return routePath === path
  })

  if (selectedMenu) {
    selectedMenus.value.push(selectedMenu.path)
    selectedMenu = selectedMenu.parent
    while (!!selectedMenu) {
      if (!selectedMenu.path && selectedMenu._fullTitle) {
        opendMenus.value.push(selectedMenu._fullTitle)
      }

      selectedMenu = selectedMenu.parent
    }
  }
})
//#endregion
</script>
<style lang="scss">
.ustra.samples {
  & .v-toolbar-title__placeholder {
    color: #fff;
    font-size: 12px;
  }

  & .v-card-item .v-card-subtitle {
    white-space: normal;
  }

  & .markdown-body {
    margin: 5px 0;
    font-size: 0.875rem;

    & table th {
      background-color: #292c30;
      color: #fff;
    }
  }

  & .v-list-item-title {
    font-size: unset;
  }

  & .v-list-item__prepend > .v-icon {
    margin-inline-end: 15px;
  }

  & .v-list-group__items .v-list-item {
    padding-inline-start: calc(-2px + var(--indent-padding)) !important;
  }

  & .v-list-group__items .v-list-item.depth3 {
    padding-inline-start: calc(-45px + var(--indent-padding)) !important;
  }

  & .v-list-item--density-compact.v-list-item--one-line {
    min-height: 35px;
  }

  & .wj-tabpanel > div > .wj-tabheaders > .wj-tabheader {
    text-transform: none;
  }

  & .monaco-editor {
  }
}
</style>
