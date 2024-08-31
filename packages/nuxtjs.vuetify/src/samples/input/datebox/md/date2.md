```html
<UVDateBox v-model="inputValue2" mode="date" />
<div>
  <v-chip class="ma-2" color="pink" label text-color="white">
    <v-icon start icon="mdi-label"></v-icon>
    inputValue2 : {{ inputValue2 }}
  </v-chip>
</div>
<UVDateBox v-model="inputValue3" mode="datetime" />
<div>
  <v-chip class="ma-2" color="pink" label text-color="white">
    <v-icon start icon="mdi-label"></v-icon>
    inputValue3 : {{ inputValue3 }}
  </v-chip>
</div>
<UVDateBox v-model="inputValue4" mode="year" />
<div>
  <v-chip class="ma-2" color="pink" label text-color="white">
    <v-icon start icon="mdi-label"></v-icon>
    inputValue4 :{{ inputValue4 }}
  </v-chip>
</div>
```
