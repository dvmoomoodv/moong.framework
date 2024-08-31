<template>
  <VApp>
    <VLayout>
      <Gnb @changeNavState="drawer = !drawer" />
      <Lnb v-model="drawer" :navigationSelected="navigationSelected" />
      <VMain>
        <div class="wrapper h-75 py-5 px-7">
          <div class="d-flex justify-space-between align-center">
            <span class="d-block text-h6 font-weight-black">
              {{ $ustra.management?.navigation?.currentProgramMenu?.mnuNm }}
              <FavoritesButton class="button favorite" />
            </span>

            <span>
              {{ $ustra.management?.navigation?.currentProgramMenu?.parentMenus[0]?.mnuNm }}
              /
              <span class="text-primary">
                {{ $ustra.management?.navigation?.currentProgramMenu?.mnuNm }}
              </span>
            </span>
          </div>
          <div class="my-7 elevation-3">
            <div class="pa-7 bg-white contents-wrapper">
              <slot />
            </div>
          </div>
        </div>
      </VMain>
      <VFooter color="primary" app>
        <v-spacer></v-spacer>
        <span style="color: white">&copy; GSITM since 2020-{{ $ustra.utils.date.format(new Date(), 'yyyy') }}</span>
      </VFooter>
    </VLayout>
  </VApp>
</template>
<script lang="ts" setup>
import { Navigation } from '#ustra/nuxt/management/store/models/navigation'
import Lnb from '#ustra/nuxt-vuetify/management/components/layout/lnb.vue' 
import Gnb from '#ustra/nuxt-vuetify/management/components/layout/gnb.vue'
import FavoritesButton from '#ustra/nuxt-vuetify/management/components/favorites-button.vue'
const { openMenu } = useUstraManagementLayoutUtils()
const drawer = ref(false)
const route = useRoute()

function navigationSelected(nav: Navigation) {
  if (nav) {
    // openMenu(nav)
    useRouter().push(nav.path)
  }
}
</script>
<style scoped lang="scss">
.wrapper {
  min-width: 800px;
  .contents-wrapper {
    min-height: calc(100dvh - 230px);
  }
}
.v-main {
  background: #fafafa;
}
</style>
