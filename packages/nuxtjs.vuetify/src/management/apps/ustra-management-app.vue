<template>
  <div v-show="mounted">
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
    <slot name="dialog">
      <UDialog />
    </slot>
    <slot name="loading-bar">
      <ULoadingBar />
    </slot>
    <slot name="config-popup">
      <ConfigPopup v-model="showConfigPopup" />
    </slot>

    <slot name="password-popup">
      <UstraManagementPasswordEditPopup
        :ref="
          instance => {
            if (instance) {
              // @ts-ignore
              passwordPopup.componentInstance.value = instance
            }
          }
        "
        @hidden="() => events.passwordPopupOnHidden.value.trigger()"
        v-model="showPasswordPopup"
      />
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useHead, setPageLayout } from '#app'
import { defineAsyncComponent, defineOptions, ref, onMounted, nextTick, watch } from '#ustra/nuxt'
import { useUstraManagementApp } from '#ustra/nuxt/management/composables'

defineOptions({
  name: 'UstraManagementApp',
})

const UDialog = defineAsyncComponent(() => import('#ustra/nuxt-vuetify/components').then(c => c.UDialog))
const ULoadingBar = defineAsyncComponent(() => import('#ustra/nuxt-vuetify/components').then(c => c.ULoadingBar))
const ConfigPopup = defineAsyncComponent(() => import('#ustra/nuxt-vuetify/management/layouts/config-popup.vue').then(c => c.default))
const UstraManagementPasswordEditPopup = defineAsyncComponent(() =>
  import('#ustra/nuxt-vuetify/management/pages/common/password-edit-popup.vue').then(c => c.default),
)
const route = useRoute()

// FIXME: class 중복으로 인한 class 조정 임시 조치
function getMainClasses() {
  const mainClasses = ref('ustra management')
  if ($ustra.env.appProps.nuxt.vuetify.samples.enabled && route.path.startsWith($ustra.env.appProps.nuxt.vuetify.samples.path)) {
    mainClasses.value = 'ustra samples'

    nextTick(() => document.body.classList.remove('management'))
  } else {
    nextTick(() => document.body.classList.add('management'))
  }
  return mainClasses
}
const mainClasses = getMainClasses()

watch(
  () => route.path,
  path => {
    getMainClasses()

    const currentRoute = $ustra.utils.router.findRoute(route.path)
    setPageLayout($ustra.management.navigation.getCurrentRouteLayoutName(currentRoute))
  },
  {
    immediate: true,
    flush: 'sync',
  },
)

// 팝업
const { showConfigPopup, showPasswordPopup, passwordPopup, events } = useUstraManagementApp()

const mounted = ref(false)
onMounted(() => {
  nextTick().then(() => (mounted.value = true))
})

useHead({
  bodyAttrs: {
    class: mainClasses.value,
  },
})
</script>
