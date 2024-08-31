<template>
  <span> #search </span>
  <span> #input </span>
  <UBox direction="row" height="100%">
    <UItem ratio="1"> Tree</UItem>
    <UItem ratio="1"> Input</UItem>
  </UBox>
  <v-data-table-virtual :headers="headers" height="400" item-value="name"></v-data-table-virtual>
  <v-data-table-virtual :headers="headers" height="400" item-value="name"></v-data-table-virtual>
  <v-data-table-virtual :headers="headers" height="400" item-value="name"></v-data-table-virtual>
</template>
<script setup type="ts">
const headers = reactive([
         { title: 'Boat Type', align: 'start', key: 'name' },
         { title: 'Speed (knots)', align: 'end', key: 'speed' },
         { title: 'Length (m)', align: 'end', key: 'length' },
         { title: 'Price ($)', align: 'end', key: 'price' },
         { title: 'Year', align: 'end', key: 'year' },
       ])
</script>
