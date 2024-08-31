<template>
  <v-app-bar color="primary" prominent>
    <v-app-bar-nav-icon variant="text" @click.stop="() => emits('changeNavState')"></v-app-bar-nav-icon>
    <v-toolbar-title class="inter weight-900"
      ><NuxtLink style="color: white; text-decoration: none" to="/main"> USTRA Framework 3 Vuetify Sample </NuxtLink></v-toolbar-title
    >

    <v-spacer></v-spacer>

    {{ $ustra.management.auth.user.userNm }}
    <config-menu />
  </v-app-bar>
</template>
<script lang="ts" setup>
import configMenu from './config-menu.vue'

const emits = defineEmits(['changeNavState'])
</script>
<script lang="ts">
export default {
  name: 'Gnb',
}
</script>
