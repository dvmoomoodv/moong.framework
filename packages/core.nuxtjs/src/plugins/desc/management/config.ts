import { Ustra, markRaw } from "#moong/nuxt";

/**
 * 설정 메뉴 인터페이스
 */
export interface ConfigMenu extends Record<string, any> {
  /**
   * 아이디
   */
  id: string;

  /**
   * 제목
   */
  title: string;

  /**
   * 노출 여부
   */
  visible: boolean;

  /**
   * 컴포넌트
   */
  component: any;

  /**
   * 아이콘
   */
  icon: string;
}

/**
 * 기본 설정 메뉴
 */
const DEFAULT_CONFIG_MENU: Partial<ConfigMenu>[] = [
  {
    id: "application",
    title: "Application",
    visible: true,
    icon: "mdi-application",
  },
  {
    id: "password",
    title: "Password",
    visible: true,
    icon: "mdi-lock-outline",
  },
];

/**
 * management 설정 관련 기능
 */
export class UstraManagementConfig {
  constructor(private $ustra: Ustra) {}

  /**
   * 설정 메뉴 조회
   */
  async getConfigMenus(): Promise<Partial<ConfigMenu>[]> {
    const defaultMenus = $ustra.utils.core.deepMerge([], DEFAULT_CONFIG_MENU);

    defaultMenus.forEach((menu) => {
      if (menu.id === "password") {
        // 비밀번호 업데이트 가능 여부 적용
        menu.visible =
          this.$ustra.management.serverAppProps.canUpdateUserPassword;
      }
    });

    const configMenus = ((await this.$ustra.hooks.callHook(
      "management:config:menu:load",
      defaultMenus
    )) || defaultMenus) as Partial<ConfigMenu>[];

    return !configMenus
      ? []
      : configMenus
          .filter((cm) => cm.visible && !!cm.component)
          .map((cm) => {
            cm.component = markRaw(cm.component);
            return cm;
          });
  }
}
