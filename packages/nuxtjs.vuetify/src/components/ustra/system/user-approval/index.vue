<template>
  <UBox direction="row" height="100%">
    <UItem ratio="1"> <v-data-table-virtual :headers="headers" height="400" item-value="name"></v-data-table-virtual></UItem>
  </UBox>
</template>
<script setup type="ts">
const headers = reactive([
         { title: '요청일시', align: 'start', key: 'name' },
         { title: '사용자아이디', align: 'end', key: 'speed' },
         { title: '회사명', align: 'end', key: 'length' },
         { title: '사용자명', align: 'end', key: 'price' },
         { title: '대상자아이디', align: 'end', key: 'year' },
         { title: '대상자명', align: 'end', key: 'year' },
         { title: '요청구분', align: 'end', key: 'year' },
         { title: '승인상태', align: 'end', key: 'year' },
         { title: '처리일시', align: 'end', key: 'year' },
       ])
</script>
