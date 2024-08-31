import { resolve } from "pathe";
import { Nuxt } from "@nuxt/schema";
import { logger } from "#moong/nuxt/utils/logger";
import { NuxtAppProps } from "#moong/nuxt/config";
// import vuetify from 'vite-plugin-vuetify'
import { addPluginProperty } from "#moong/nuxt/kit";

export const pluginsManagement = async (options: NuxtAppProps, nuxt: Nuxt) => {
  // add management plugin props
  if (options.nuxt.management.enabled) {
    if (options.nuxt.management.ui.componentType === "vuetify") {
      addPluginProperty(
        "vuetify",
        resolve("../plugins/vuetify.ts"),
        "#moong/nuxt-vuetify/plugins/vuetify"
      );
    }
  }
};
