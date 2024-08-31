import type { ProgramMenu } from "#moong/nuxt/management/store/models/navigation";
import { getCurrentInstance, onMounted, markRaw } from "#moong/nuxt";
import { useUstraNavigationStore } from "../store/navigation";

/**
 * 관리 기능 navigation 변경 callback 등록
 * @param callback 콜백
 */
export const onUstraNavigationChanged = <T = any>(
  callback: (menu: ProgramMenu, data: T) => void
) => {
  const instance = getCurrentInstance();

  onMounted(async () => {
    const navStore = await useUstraNavigationStore();
    // 현재 메뉴 정보가 존재할 경우
    if (navStore.currentProgramMenu) {
      navStore.currentProgramMenu.componentCallback = markRaw((menu) => {
        if (callback) {
          const componentData = menu.componentData;
          delete menu.componentData;
          callback(menu, componentData);
        }
      });

      navStore.currentProgramMenu.componentCallback(
        navStore.currentProgramMenu
      );
    }
  });
};
