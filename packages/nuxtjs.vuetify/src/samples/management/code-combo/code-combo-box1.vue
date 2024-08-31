<template>
  <v-card>
    <template #title> 공통코드 콤보 박스 </template>
    <!-- <template #subtitle
      >UCodeComboBox 컴포넌트를 사용하여 공통 코드를 콤보박스에 바인딩할 수 있다. <br />
      grpCd Prop으로 그룹 코드를 지정하면 그룹 코드에 해당하는 코드 목록이 콤보박스에 바인딩된다. 이 때 초기 값이 null 또는 공백일 경우 value 값은
      목록의 첫번째 항목으로 변경된다. <br />
      <br />
      선택된 value 값을 문자 형태로 변경할 경우 v-model을 사용하며, v-model:objectValue 속성을 사용하여 Object 형태의 수신도 가능하다. 단 해당 속성은
      값을 전달하지는 않으므로 해당 Prop이 변경되어도 현재 선택된 항목이 변경되지는 않는다.
    </template> -->

    <template #text>
      <!-- <UCodeComboBox :grpCd="grpCd" v-model="comboValue" v-model:objectValue="comboObjectValue" /> -->

      <UVCodeComboBox
        :grpCd="grpCd"
        v-model="comboValue"
        v-model:objectValue="comboObjectValue"
      />
      <div>
        <v-chip class="ma-2" color="pink" label text-color="white">
          <v-icon start icon="mdi-label"></v-icon>
          comboValue : {{ comboValue }}
        </v-chip>
        <v-chip class="ma-2" color="pink" label text-color="white">
          <v-icon start icon="mdi-label"></v-icon>
          comboObjectValue :{{ comboObjectValue }}
        </v-chip>
      </div>
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from "#moong/nuxt";
import { useUstraCodeList } from "#moong/nuxt/management/composables";
import { UMarkdownViewer } from "#moong/nuxt/components";
import UVCodeComboBox from "#moong/nuxt-vuetify/management/components/combo-box/u-v-code-combo-box.vue";

// @ts-ignore
import desc from "./md/code-combo-box1.md";

const comboValue = ref("SC");
const comboObjectValue = ref(null);
const grpCd = ref("SYS_CD");

function changeComboValue() {
  const codes = useUstraCodeList(grpCd.value, true);

  if (codes.length > 0) {
    comboValue.value = codes[codes.length - 1].dtlCd;
  }
}
</script>
<script lang="ts">
export default {
  name: "CodeComboBox1",
};
</script>
