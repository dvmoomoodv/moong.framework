> 연동 포맷은 v-model을 통해 설정한다. 
> - 기본적으로 시작일 종료일을 배열로 구성하여 셋팅하며 값이 없을 경우, [null, null] 형태로 바인딩한다.
```html
<UVDatePeriodBox v-model="dateArr1" />
<div>
  <v-chip class="ma-2" color="pink" label text-color="white">
    <v-icon start icon="mdi-label"></v-icon>
    dateArr1 : {{ dateArr1 }}
  </v-chip>
</div>
<VBtn text="배열 일자 반영" @click="dateArr1 = ['20220507', '20221009']"></VBtn>
<VBtn text="배열 null 반영" @click="dateArr1 = [null, null]"></VBtn>
```
