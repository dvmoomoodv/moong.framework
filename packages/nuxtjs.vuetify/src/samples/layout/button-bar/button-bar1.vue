<template>
  <v-card>
    <template #title> ButtonBar</template>
    <template #subtitle> </template>
    <template #text>
      <div class="sample-wrap">
        <UButtonBar title="제목">
          <UButtonBox center>
            <VBtn type="primary">신규</VBtn>
          </UButtonBox>
        </UButtonBar>
        <div style="margin: 15px"></div>
        <UButtonBar>
          <UFieldSet>
            <UFieldRow>
              <UField label="필드1"><WjComboBox></WjComboBox> </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="필드1"><WjComboBox></WjComboBox> </UField>
            </UFieldRow>
            <UFieldRow>
              <UField label="필드1"><WjComboBox></WjComboBox> </UField>
            </UFieldRow>
          </UFieldSet>
        </UButtonBar>
      </div>

      <!-- <UMarkdownViewer>
        {{ buttonBar1 }}
      </UMarkdownViewer> -->
    </template>
  </v-card>
</template>

<script setup lang="ts">
import './style/form.scss'
import buttonBar1 from './md/button-bar1.md'
</script>

<style scoped></style>
