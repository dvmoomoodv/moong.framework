<template>
  <UPopup :width="800" :height="600" title="설정" v-model="modelValue" theme="light" @shown="init">
    <VApp>
      <VNavigationDrawer v-model="drawer" app :width="200" density="compact" theme="dark">
        <VList
          ref="menuList"
          density="compact"
          :mandatory="true"
          @click:select="
            ({ id, value, path }) => {
              if (value) {
                selectedMenuValue = id
              }
            }
          "
        >
          <template v-for="item in configMenus" :key="item.id">
            <VListItem :prepend-icon="item.icon" :value="item.id" :title="item.title" density="compact"></VListItem>
          </template>
        </VList>
      </VNavigationDrawer>
      <VMain scrollable:="false">
        <VContainer>
          <v-btn
            icon="mdi-menu-open"
            color="success"
            variant="elevated"
            style="position: absolute; right: 0; top: 0; z-index: 1"
            @click="drawer = !drawer"
          ></v-btn>
          <ConfigPopupApplication v-if="selectedMenuValue === 'application'"/>
          <ConfigPopupPassword v-if="selectedMenuValue === 'password'"/>
        </VContainer>
      </VMain>
    </VApp>
  </UPopup>
</template>
<script lang="ts" setup>
import { defineProps, shallowRef, ref, computed, onMounted } from '#moong/nuxt'
import { UPopup } from '#moong/nuxt-vuetify/components'
import { useVModel } from '@vueuse/core'
import {ConfigMenu} from '#moong/nuxt'
import { VList } from 'vuetify/components'
import ConfigPopupApplication from '#moong/nuxt-vuetify/management/components/config/application.vue'
import ConfigPopupPassword from '#moong/nuxt-vuetify/management/components/config/password.vue'

const drawer = ref(true)
const toggle = ref(null)
const props = defineProps<{
  modelValue: boolean
}>()
const modelValue = useVModel(props, 'modelValue')

const selectedMenuValue = ref(null)
const configMenus: Partial<ConfigMenu>[] = reactive([
  {
    id: 'application',
    title: 'Application',
    visible: true,
    icon: 'mdi-application',
  },
  {
    id: 'password',
    title: 'Password',
    visible: true,
    icon: 'mdi-lock-outline',
  },
])

const menuList = ref<InstanceType<typeof VList>>()


function init() {
  selectedMenuValue.value = configMenus.length > 0 ? configMenus[0].id : null

  if (configMenus.length > 0) {
    menuList.value.select(configMenus[0].id, true)
  }
}
</script>
<script lang="ts">
export default {
  name: 'ConfigPopup',
}
</script>
