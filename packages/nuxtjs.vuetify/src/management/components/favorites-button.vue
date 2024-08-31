<template>
  <v-icon icon="mdi-star-outline" alt="즐겨찾기" v-if="currentMenu" v-show="!isFavoriteMenu" @click="toggleFavorite"></v-icon>
  <v-icon icon="mdi-star-settings" alt="즐겨찾기" v-if="currentMenu" v-show="isFavoriteMenu" @click="toggleFavorite"></v-icon>
</template>
<script lang="ts" setup>
import { computed } from '#ustra/nuxt'
import { useUstraUserMenuService } from '#ustra/nuxt/management'

const userMenuService = useUstraUserMenuService()

const currentMenu = computed(() => {
  return $ustra.management.store.navigation.currentProgramMenu
})

const isFavoriteMenu = computed(() => {
  return !!currentMenu.value && $ustra.management.store.navigation.userMenus.some(um => um.mnuId === currentMenu.value.mnuId)
})

async function toggleFavorite(e) {
  e.stopPropagation()

  if (isFavoriteMenu.value) {
    await userMenuService.removeMenu({ mnuId: currentMenu.value.mnuId })
  } else {
    await userMenuService.addMenu({ mnuId: currentMenu.value.mnuId })
  }

  $ustra.management.store.navigation.loadUserMenus()
}
</script>
<script lang="ts">
export default {
  name: 'FavoritesButton',
}
</script>
<style scoped>
.mdi {
  &:before {
    font-size: 1.5rem;
  }
}
</style>
