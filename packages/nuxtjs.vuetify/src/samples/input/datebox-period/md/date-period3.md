> - mode에 따른 displayFormat 기본 값
> -- 'date' mode : 'yyyy-MM-dd'
> -- 'datetime' mode : 'yyyy-MM-dd HH:mm:ss'
> - mode에 따른 valueFormat 기본 값
> -- 'date' mode : 'yyyyMMdd'
> -- 'datetime' mode : 'yyyyMMddHHmmss'

[주의] valueFormat에 따라 데이터가 바인딩 되어야한다.예를 들어 valueFormat="yyyyMM"인 경우, "20220901"을 바인딩 할 수 없다.

```html
<UVDatePeriodBox v-model="dateArr6" mode="datetime" displayFormat="yyyy/MM/dd" valueFormat="yyyyMMdd" />
<v-chip class="ma-2" color="pink" label text-color="white">
  <v-icon start icon="mdi-label"></v-icon>
  dateArr6 : {{ dateArr6 }}
</v-chip>
```
