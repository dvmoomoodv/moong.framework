<template>
  <div>
    <span class="d-block text-h5 font-weight-black mb-10"> Dashboard </span>
    <VRow>
      <VCol cols="12" md="4">
        <v-card>
          <template v-slot:title> This is a title </template>

          <template v-slot:subtitle> This is a card subtitle </template>

          <template v-slot:text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi,
            ratione debitis quis est labore voluptatibus!
          </template>
        </v-card>
      </VCol>
      <VCol cols="12" md="8">
        <v-card>
          <template v-slot:title> This is a title </template>

          <template v-slot:subtitle> This is a card subtitle </template>

          <template v-slot:text>
            <LineChart />
          </template>
        </v-card>
      </VCol>
      <VCol cols="12" md="8">
        <v-card>
          <template v-slot:title> This is a title </template>

          <template v-slot:subtitle> This is a card subtitle </template>

          <template v-slot:text>
            <BarChart />
          </template>
        </v-card>
      </VCol>
      <VCol cols="12" md="4">
        <v-card>
          <template v-slot:title> This is a title </template>

          <template v-slot:subtitle> This is a card subtitle </template>

          <template v-slot:text>
            <PieChart />
          </template>
        </v-card>
      </VCol>
    </VRow>
  </div>
</template>
<script setup type="ts">
import PieChart from '#moong/nuxt-vuetify/components/ustra/sample/chart/pie-chart.vue';
import LineChart from '#moong/nuxt-vuetify/components/ustra/sample/chart/line-chart.vue';
import BarChart from '#moong/nuxt-vuetify/components/ustra/sample/chart/bar-chart.vue';


definePageMeta({
  auth: {
    required: true,
  },
  layout: 'ustra'
})
</script>
<style scoped lang="scss">
.v-card {
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
