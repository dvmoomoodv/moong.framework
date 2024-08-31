> 위 샘플에서 지정 된 mode의 종류는 순서대로 다음과 같다.
> - date : 일자
> - datetime : 일자 및 시분
> - year : 년도

```html
<UVDatePeriodBox v-model="dateArr2" mode="date" />
<div>
  <v-chip class="ma-2" color="pink" label text-color="white">
    <v-icon start icon="mdi-label"></v-icon>
    dateArr2 : {{ dateArr2 }}
  </v-chip>
</div>
<UVDatePeriodBox v-model="dateArr3" mode="datetime" />
<div>
  <v-chip class="ma-2" color="pink" label text-color="white">
    <v-icon start icon="mdi-label"></v-icon>
    dateArr3 : {{ dateArr3 }}
  </v-chip>
</div>
<UVDatePeriodBox v-model="dateArr4" mode="year" />
<div>
  <v-chip class="ma-2" color="pink" label text-color="white">
    <v-icon start icon="mdi-label"></v-icon>
    dateArr4 :{{ dateArr4 }}
  </v-chip>
</div>
</div>
```
