import { Ustra } from "#moong/nuxt/plugins/ustra";
import { NuxtVuetifyManagement } from "./desc/management";

export class NuxtVuetify {
  management: NuxtVuetifyManagement = null;

  constructor($ustra: Ustra) {
    this.management = new NuxtVuetifyManagement($ustra);
  }
}

export default ($ustra: Ustra) => {
  const instance = new NuxtVuetify($ustra);
  return instance;
};
