```html
<UVDateBox v-model="inputValue1"/>
<div>
  <v-chip class="ma-2" color="pink" label text-color="white">
    <v-icon start icon="mdi-label"></v-icon>
    inputValue1 : {{ inputValue1 }}
  </v-chip>
</div>
<VBtn @click="inputValue1 = '20220507'">일자 반영</VBtn>
<VBtn class="ml-1" @click="inputValue1 = null">null 반영</VBtn>
```
