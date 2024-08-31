```html
<!-- template -->
<UVDatePeriodBox v-model="dateArr8" mode="datetime" :isDefaultValue="true" />
<v-chip class="ma-2" color="pink" label text-color="white">
  <v-icon start icon="mdi-label"></v-icon>
  dateArr8 : {{ dateArr8 }}
</v-chip>

...

<!-- script -->
<script lang="ts" setup>
  <!-- null값 바인딩 -->
  const dateArr8 = ref([null, null])
</script>
```
