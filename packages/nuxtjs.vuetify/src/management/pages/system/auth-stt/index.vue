<template>
  <v-tabs v-model="tab" bg-color="primary">
    <v-tab value="tab1">사용자별 권한</v-tab>
    <v-tab value="tab2">기간별 신규 권한</v-tab>
    <v-tab value="tab3">현재 권한 현황</v-tab>
    <v-tab value="tab4">권한 그룹 이력</v-tab>
    <v-tab value="tab5">권한 변경 이력</v-tab>
  </v-tabs>
  <v-window v-model="tab">
    <v-window-item value="tab1">
      <UserAuthStt></UserAuthStt>
    </v-window-item>
    <v-window-item value="tab2">
      <PeriodAuth v-if="tab === 'tab2'"></PeriodAuth>
    </v-window-item>
    <v-window-item value="tab3">
      <CurrentAuthStt v-if="tab === 'tab3'"></CurrentAuthStt>
    </v-window-item>
    <v-window-item value="tab4">
      <AuthGrpHist v-if="tab === 'tab4'"></AuthGrpHist>
    </v-window-item>
    <v-window-item value="tab5">
      <AuthHist v-if="tab === 'tab5'"></AuthHist>
    </v-window-item>
  </v-window>
</template>
<script type="ts">
import UserAuthStt from './user-auth-stt/index.vue'
import PeriodAuth from './period-auth/index.vue'
import CurrentAuthStt from './current-auth-stt/index.vue'
import AuthGrpHist from './auth-grp-hist/index.vue'
import AuthHist from './auth-hist/index.vue'

definePageMeta({
  layout: 'ustra'
})
</script>
<script setup type="ts">
const tab = ref('tab1')
</script>
