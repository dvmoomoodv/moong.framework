import { NuxtAppProps } from "#moong/nuxt/config";
import { addComponent } from "#moong/nuxt/kit";
import { Nuxt } from "@nuxt/schema";
import { logger } from "#moong/nuxt/utils/logger";

function addManagementComponent() {
  logger.info(`😸 add Vuetify Managment Component`);
  // //#region check-box
  // addComponent({
  //   name: 'UVCodeCheckGroupBox',
  //   global: true,
  //   filePath: '#moong/nuxt-vuetify/management/components/check-box/u-v-code-check-group-box.vue',
  // })
  // //#endregion

  // //#region combo-box
  // addComponent({
  //   name: 'UVCodeAutoComplete',
  //   global: true,
  //   filePath: '#moong/nuxt-vuetify/management/components/check-box/u-v-code-auto-complete.vue',
  // })
  // addComponent({
  //   name: 'UVCodeComboBox',
  //   global: true,
  //   filePath: '#moong/nuxt-vuetify/management/components/check-box/u-v-code-combo-box.vue',
  // })
  // addComponent({
  //   name: 'UVCodeMultiComboBox',
  //   global: true,
  //   filePath: '#moong/nuxt-vuetify/management/components/check-box/u-v-code-multi-comobo-box.vue',
  // })
  // //#endregion

  // //#region file
  // addComponent({
  //   name: 'UVSingleFileUploader',
  //   global: true,
  //   filePath: '#moong/nuxt-vuetify/management/components/check-box/u-v-single-file-uploader.vue',
  // })
  // //#endregion

  // //#region input
  // addComponent({
  //   name: 'UVCodeInputBox',
  //   global: true,
  //   filePath: '#moong/nuxt-vuetify/management/components/check-box/u-v-code-input-box.vue',
  // })
  // addComponent({
  //   name: 'UVMenuInputBox',
  //   global: true,
  //   filePath: '#moong/nuxt-vuetify/management/components/check-box/u-v-menu-input-box.vue',
  // })
  // addComponent({
  //   name: 'UVUserInputBox',
  //   global: true,
  //   filePath: '#moong/nuxt-vuetify/management/components/check-box/u-v-user-input-box.vue',
  // })
  // //#endregion

  // //#region popup
  // addComponent({
  //   name: 'UVCodePopup',
  //   global: true,
  //   filePath: '#moong/nuxt-vuetify/management/components/check-box/u-v-code-popup.vue',
  // })
  // addComponent({
  //   name: 'UVMenuPopup',
  //   global: true,
  //   filePath: '#moong/nuxt-vuetify/management/components/check-box/u-v-menu-popup.vue',
  // })
  // addComponent({
  //   name: 'UVUserPopup',
  //   global: true,
  //   filePath: '#moong/nuxt-vuetify/management/components/check-box/u-v-user-popup.vue',
  // })
  // //#endregion

  // //#region radio
  // addComponent({
  //   name: 'UVCodeRadioGroupBox',
  //   global: true,
  //   filePath: '#moong/nuxt-vuetify/management/components/check-box/u-v-code-radio-group-box.vue',
  // })
  // //endregion
}

export const components = (options: NuxtAppProps, nuxt: Nuxt) => {
  //#region Layout
  addComponent({
    name: "ULayout",
    global: true,
    filePath: "#moong/nuxt-vuetify/components/layout/u-layout.vue",
  });
  addComponent({
    name: "UBox",
    global: true,
    filePath: "#moong/nuxt-vuetify/components/layout/u-box.vue",
  });
  addComponent({
    name: "UItem",
    global: true,
    filePath: "#moong/nuxt-vuetify/components/layout/u-item.vue",
  });
  addComponent({
    name: "URow",
    global: true,
    filePath: "#moong/nuxt-vuetify/components/layout/u-row.vue",
  });
  addComponent({
    name: "UCol",
    global: true,
    filePath: "#moong/nuxt-vuetify/components/layout/u-col.vue",
  });
  //#endregion

  //#region Form

  addComponent({
    name: "UFieldSet",
    global: true,
    filePath: "#moong/nuxt-vuetify/components/form/u-field-set.vue",
  });
  addComponent({
    name: "UFieldRow",
    global: true,
    filePath: "#moong/nuxt-vuetify/components/form/u-field-row.vue",
  });
  addComponent({
    name: "UField",
    global: true,
    filePath: "#moong/nuxt-vuetify/components/form/u-field.vue",
  });
  addComponent({
    name: "UButtonBox",
    global: true,
    filePath: "#moong/nuxt-vuetify/components/form/u-button-box.vue",
  });
  addComponent({
    name: "UButtonBar",
    global: true,
    filePath: "#moong/nuxt-vuetify/components/form/u-button-bar.vue",
  });
  addComponent({
    name: "USpacer",
    global: true,
    filePath: "#moong/nuxt-vuetify/components/form/u-spacer.vue",
  });
  addComponent({
    name: "UToolbarItem",
    global: true,
    filePath: "#moong/nuxt-vuetify/components/form/u-toolbar-item.vue",
  });
  addComponent({
    name: "UToolbar",
    global: true,
    filePath: "#moong/nuxt-vuetify/components/form/u-toolbar.vue",
  });
  addComponent({
    name: "UHelpBox",
    global: true,
    filePath: "#moong/nuxt-vuetify/components/form/u-help-box.vue",
  });
  addComponent({
    name: "UDaumPostPopup",
    global: true,
    filePath: "#moong/nuxt-vuetify/components/daum/u-daum-post-popup.vue",
  });
  //#endregion

  //#region Navigation
  addComponent({
    name: "UPopup",
    global: true,
    filePath: "#moong/nuxt-vuetify/components/dialog/u-popup.vue",
  });
  //#endregion

  if (options.nuxt.vuetify?.datepicker?.enabled) {
    addComponent({
      name: "UDatepicker",
      global: true,
      filePath: "#moong/nuxt-vuetify/components/form/u-datepicker.vue",
    });
  }

  if (!options.nuxt.wijmo.enabled) {
    addComponent({
      name: "UValidationGroup",
      global: true,
      filePath: "#moong/nuxt-vuetify/components/form/u-validation-group.vue",
    });

    addComponent({
      name: "UBizNoBox",
      global: true,
      filePath: "#moong/nuxt-vuetify/components/form/u-biz-no-box.vue",
    });

    addComponent({
      name: "UCorpNoBox",
      global: true,
      filePath: "#moong/nuxt-vuetify/components/form/u-corp-no-box.vue",
    });

    addComponent({
      name: "UPhoneNoBox",
      global: true,
      filePath: "#moong/nuxt-vuetify/components/form/u-phone-no-box.vue",
    });
  }

  if (options.nuxt.management.enabled) {
    if (options.nuxt.management.ui.componentType === "vuetify") {
      addManagementComponent();
    }
  }
};
