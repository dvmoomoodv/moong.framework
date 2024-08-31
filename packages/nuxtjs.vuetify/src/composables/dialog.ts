import { dom } from "#moong/core/utils/browser";

/**
 * vuetify dialog open 여부
 */
export const isOpendVuetifyDialog = (checkHidden = true) => {
  const dialogEls = document.querySelectorAll(".v-dialog");
  if (dialogEls.length <= 0) {
    return false;
  }

  if (!checkHidden) {
    return true;
  }

  for (const el of dialogEls) {
    if (!dom.isHidden(el)) {
      return true;
    }
  }

  return false;
};
