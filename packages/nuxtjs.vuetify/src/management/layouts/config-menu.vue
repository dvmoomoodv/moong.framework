<template>
  <v-menu left bottom theme="dark" v-model="showMenu">
    <template v-slot:activator="{ props }">
      <VBtn icon v-bind="props">
        <v-icon>mdi-account</v-icon>
      </VBtn>
    </template>

    <v-list density="compact" class="config-menu-list">
      <v-list-item v-for="(menu, index) in configMenus" :key="index" @click="menu.onClick">
        <template #prepend>
          <v-icon :icon="menu.icon"></v-icon>
        </template>
        <v-list-item-title>{{ menu.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
  <ConfigPopup v-model="showConfigPopup" />
</template>
<script lang="ts" setup>
// import { useUstraManagementLayout } from '#ustra/nuxt/management/composables'
import { useRouter } from '#app'
import { computed, ref, nextTick } from '#ustra/nuxt'
import { useUstraManagementApp } from '#ustra/nuxt/management/composables/ui'
import ConfigPopup from './config-popup.vue'

const showMenu = ref(false)

/**
 * 팝업 오픈 여부
 */
const { showConfigPopup } = useUstraManagementApp()

/**
 * 설정 메뉴 정보
 */
const configMenus = computed(() => {
  // const sampleProps = $ustra.env.appProps.nuxt.wijmo.samples
  // const useSample = sampleProps.enabled
  const menus: Object[] = []

  menus.push({
    title: '설정',
    icon: 'mdi-cog-outline',
    onClick(e) {
      setTimeout(() => (showMenu.value = false), 200)
      showConfigPopup.value = true

      // e.stopImmediatePropagation()
    },
  })

  // if (useSample) {
  menus.push({
    title: '샘플',
    icon: 'mdi-comment-text-multiple-outline',
    onClick() {
      useRouter().push('/samples/vuetify')
    },
  })
  // }

  menus.push({
    title: '로그아웃',
    icon: 'mdi-logout',
    async onClick() {
      const result = await confirm('로그아웃 하시겠습니까?')

      if (result) {
        $ustra.management.auth.logout()
      }
    },
  })

  return menus
})
</script>
<script lang="ts">
export default {
  name: 'ConfigMenu',
}
</script>
