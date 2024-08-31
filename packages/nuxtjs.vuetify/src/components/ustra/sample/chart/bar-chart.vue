<template>
  <div>
    <apexchart type="bar" height="350" :options="chartOptions" :series="series" />
  </div>
</template>

<script setup>
import ApexCharts from 'vue3-apexcharts'

const series = ref([
  {
    name: 'Sales',
    data: [30, 40, 45, 50, 49, 60, 70, 91, 125],
  },
])

const chartOptions = ref({
  chart: {
    height: 350,
    type: 'bar',
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  },
})
</script>
