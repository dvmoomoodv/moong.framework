<template>
  <v-card>
    <template #title> Form Layout + Button</template>
    <template #subtitle> </template>
    <template #text>
      <div class="sample-wrap">
        <UFieldSet>
          <UFieldRow>
            <UField label="필드1" direction="col" itemDirection="row"
              ><v-text-field></v-text-field>
            </UField>
            <UField blank center middle>
              <UButtonBox>
                <v-btn>수정</v-btn>
                <v-btn>삭제</v-btn>
              </UButtonBox>
            </UField>
          </UFieldRow>
          <UFieldRow>
            <UField label="필드1" itemDirection="row">
              <v-text-field></v-text-field>
            </UField>
            <UField blank>
              <UButtonBox right>
                <v-btn>수정</v-btn>
                <v-btn>삭제</v-btn>
              </UButtonBox>
            </UField>
          </UFieldRow>
        </UFieldSet>
      </div>

      <!-- <UMarkdownViewer>
        {{ form7 }}
      </UMarkdownViewer> -->
    </template>
  </v-card>
</template>

<script setup lang="ts">
import "./style/form.scss";
import form7 from "./md/form7.md";
import UField from "#moong/nuxt-vuetify/components/form/u-field.vue";
</script>

<style scoped></style>
