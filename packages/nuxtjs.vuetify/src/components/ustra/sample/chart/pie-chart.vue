<template>
  <div>
    <apexchart type="pie" height="350" :options="chartOptions" :series="series" />
  </div>
</template>

<script setup>
import ApexCharts from 'vue3-apexcharts'

const series = ref([44, 55, 13, 43, 22])

const chartOptions = ref({
  labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
})
</script>
