<template>
  <div>
    <apexchart type="line" height="350" :options="chartOptions" :series="series" />
  </div>
</template>

<script setup>
import ApexCharts from 'vue3-apexcharts'

const series = ref([
  {
    name: 'Desktops',
    data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
  },
])

const chartOptions = ref({
  chart: {
    height: 350,
    type: 'line',
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  },
})
</script>
