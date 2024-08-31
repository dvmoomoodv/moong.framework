<template>
  <template v-for="(item, index) in props.menus" :key="index">
    <VListGroup v-if="item.items && item.items.length > 0" v-model="item.selected" :value="item._fullTitle">
      <template v-slot:activator="{ props: prop }">
        <VListItem v-bind="prop" :prepend-icon="item.icon" :title="item.title" density="compact" :class="['depth' + props.depth]">
          <template v-if="item.updated" v-slot:append>
            <VIcon color="orange lighten-1">mdi-new-box</VIcon>
            <VIcon>mdi-chevron-down</VIcon>
          </template>
        </VListItem>
      </template>

      <ListItems :menus="item.items" :depth="props.depth + 1" :parent="instance" />
    </VListGroup>
    <VListItem
      v-else
      v-model="item.selected"
      :prepend-icon="item.icon"
      :value="item.path"
      :title="item.title"
      density="compact"
      @click="() => clickItem(item)"
      :class="['depth' + props.depth]"
    >
      <template v-if="item.updated" v-slot:append>
        <VIcon color="orange lighten-1">mdi-new-box</VIcon>
      </template>
    </VListItem>
  </template>
</template>
<script lang="ts" setup>
import { defineProps, withDefaults, getCurrentInstance } from '#ustra/nuxt'
import { SampleMenu } from './_data/sample-menu'
import { useRouter } from '#app'
import { useUstraUtils, useUstraEnv } from '#ustra/nuxt'
import ListItems from './list-items.vue'

const instance = getCurrentInstance()

const props = withDefaults(
  defineProps<{
    menus: SampleMenu[]
    depth?: number
    parent?: InstanceType<typeof ListItems>
  }>(),
  {
    depth: 1,
  },
)

function clickItem(item: SampleMenu) {
  const utils = useUstraUtils()
  if (item.path) {
    const target = utils.path.withoutExt(utils.path.join(useUstraEnv().appProps.nuxt.vuetify.samples.path, item.path.replace(/\//g, '-')))
    useRouter().push(target)

    window.scrollTo(0, 0)
  }
}
</script>
<script lang="ts">
export default {
  name: 'ListItems',
}
</script>
