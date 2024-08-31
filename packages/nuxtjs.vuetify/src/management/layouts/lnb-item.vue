<template>
  <div>
    <div v-for="(nav, i) in displayNavigations" :key="i" :value="item" color="primary">
      <template  v-if="!!nav.items && nav.items.filter(n => n.visible).length > 0">
        <v-list-group value:="nav.text">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" >
              <template v-slot:prepend>
            <v-icon>{{ nav.id === 'favorites' ? 'mdi-star' : 'mdi-folder' }}</v-icon>
          </template>

          <v-list-item-title v-text:="nav.text"></v-list-item-title>
            </v-list-item>
          </template>

          <LnbItem :navigationSelected="props.navigationSelected" :navigations="nav.items" :depth="props.depth + 1" />
        </v-list-group>
      </template>
      <template v-else>
        <v-list-item @click.stop="e => onClickItem(e, nav)">
          <template v-slot:prepend>
            <v-icon v-if="props.depth < 2">{{ nav.id === 'favorites' ? 'mdi-star' : 'mdi-folder' }}</v-icon>
          </template>

          <v-list-item-title v-text:="nav.text"></v-list-item-title>
        </v-list-item>

        <LnbItem :navigationSelected="props.navigationSelected" :navigations="nav.items" :depth="props.depth + 1" />
      </template>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { Navigation } from '#ustra/nuxt/management/store/models/navigation'
import { useUstraUserMenuService } from '#ustra/nuxt/management'
import LnbItem from './lnb-item.vue'

const userMenuService = useUstraUserMenuService()

const props = defineProps({
  /**
   * navigation 목록
   */
  navigations: { type: Object as PropType<Navigation[]>, default: [] },

  /**
   * 메뉴 depth
   */
  depth: { type: Number, default: 1 },

  /**
   * 메뉴 선택 시 callback function
   */
  navigationSelected: Function as PropType<(nav: Navigation) => void | Promise<void>>,
})

const displayNavigations = computed(() => props.navigations.filter(nav => nav.visible))

function onClickItem(e: Event, nav: Navigation) {
  e.preventDefault()
  e.stopImmediatePropagation()

  const hasPath = !!nav.path
  if (hasPath) {
    const component = $ustra.utils.router.findComponentByPath(nav.path)

    if (!component) {
      alert('선택 메뉴는 존재하지 않습니다. 관리자에게 문의하시기 바랍니다.')
      return
    }

    // 로컬 환경일 때는 메뉴 클릭 시, 항상 refresh 처리
    if (!nav.component || $ustra.env.isDev) {
      nav.component = markRaw(component)
    }
  }
  props.navigationSelected(nav)

  nav.active = hasPath ? true : !nav.active
}
</script>
<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>
