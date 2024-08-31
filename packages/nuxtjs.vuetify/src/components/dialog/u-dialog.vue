<template>
  <v-dialog v-model="dialogStates.showDialog.value" :max-width="600">
    <v-card v-if="dialogStates.lastDialogInfo.value">
      <v-card-title
        class="text-h5"
        v-if="dialogStates.lastDialogInfo.value.title"
        >{{ dialogStates.lastDialogInfo.value.title }}</v-card-title
      >
      <v-card-text
        style="min-width: 400px"
        v-html="dialogStates.message.value"
      ></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <template
          v-if="
            dialogStates.lastDialogInfo.value &&
            dialogStates.lastDialogInfo.value.type === 'confirm'
          "
        >
          <v-btn
            color="green-darken-1"
            @click="
              () => {
                dialogStates.confirmResult.value = true;
                dialogStates.showDialog.value = false;
              }
            "
          >
            Ok
          </v-btn>
          <v-btn
            color="red-darken-1"
            @click="
              () => {
                dialogStates.confirmResult.value = false;
                dialogStates.showDialog.value = false;
              }
            "
          >
            Cancel
          </v-btn>
        </template>

        <template
          v-if="
            dialogStates.lastDialogInfo.value &&
            dialogStates.lastDialogInfo.value.type === 'alert'
          "
        >
          <v-btn @click="() => (dialogStates.showDialog.value = false)">
            Close
          </v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar
    v-model="toastStates.showToast.value"
    :rounded="true"
    :timeout="2000"
    v-if="toastStates.currentToast.value"
    @update:modelValue="
      (v) => {
        if (!v) {
          toastStates.showNextToast();
        }
      }
    "
    >{{ toastStates.currentToast.value.text }}</v-snackbar
  >
</template>
<script lang="ts" setup>
import { defineUstraDialogComponent } from "#moong/nuxt/composables/components/dialog";

const { dialogStates, toastStates } = defineUstraDialogComponent({
  hideDialogWhenRouteChanges: true,
});
</script>

<script lang="ts">
export default {
  name: "UDialog",
};
</script>
