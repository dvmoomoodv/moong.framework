import { apiModels } from "#moong/core/data";
import { defineUstraService } from "#moong/nuxt/composables";
import { UsrApvTyCd } from "../models/common-code";
import { Auth, AuthMenuTreeData } from "../models/auth";

/**
 * 권한 서비스
 */
export const useUstraAuthService = defineUstraService(({ api }) => {
  /**
   * 권한 그룹의 권한 정보 조회
   */
  async function getAuthGroupInfo(authGrpId: number, sysCd?: string) {
    const res = await api.call<apiModels.ApiResponse<Auth>>({
      url: `/api/system/authority/auth-grp?authGrpId=${authGrpId}`,
      method: "GET",
    });

    res.data.body.menus = createMenuData(res.data.body.menus, sysCd);
    return res.data.body;
  }

  /**
   * 사용자의 권한 정보 조회
   */
  async function getUserAuthInfo(usrId: string, sysCd?: string) {
    const res = await api.call<apiModels.ApiResponse<Auth>>({
      url: `/api/system/authority/user?usrId=${usrId}`,
      method: "GET",
    });

    res.data.body.menus = createMenuData(res.data.body.menus, sysCd);
    return res.data.body;
  }

  /**
   * 승인 권한 소유 여부 확인
   * @param usrId 사용자 아이디
   * @param targetUsrId 대상 사용자 아이디
   * @param usrApvTyCd 사용자 승인 유형 코드
   */
  async function hasApprovalAuth(
    usrId: string,
    targetUsrId: string,
    usrApvTyCd: UsrApvTyCd
  ) {
    const url = api
      .urlBuilder("/api/system/authority/has-approval")
      .add("usrId", usrId)
      .add("targetUsrId", targetUsrId)
      .add("usrApvTyCd", usrApvTyCd)
      .build();

    return (
      await api.call<apiModels.ApiResponse<boolean>>({
        url,
        method: "GET",
      })
    )?.data?.body;
  }

  // 권한 설정에서 사용할 메뉴 데이터 생성
  function createMenuData(menuData: AuthMenuTreeData[], sysCd?: string) {
    const findMenuById = (
      menus: AuthMenuTreeData[],
      mnuId: string
    ): AuthMenuTreeData => {
      if (!menus) {
        return null;
      }

      for (const menu of menus) {
        if (menu.mnuId === mnuId) {
          return menu;
        }

        const subMenu = findMenuById(menu.items, mnuId);
        if (subMenu) {
          return subMenu;
        }
      }
    };

    const menus: AuthMenuTreeData[] = [];
    for (const ag of menuData) {
      const treeMenu: AuthMenuTreeData = ag;
      treeMenu.items = [];
      treeMenu.expanded = false;
      treeMenu.selected = ag.authYn === "Y";

      if (!treeMenu.uprMnuId) {
        menus.push(treeMenu);
      } else {
        const uprAuthGroup = findMenuById(menus, treeMenu.uprMnuId);

        if (uprAuthGroup) {
          uprAuthGroup.items.push(treeMenu);

          let dataCount = 0;
          if (uprAuthGroup.selected) {
            uprAuthGroup.items.forEach((item) => {
              if (!item.selected) {
                dataCount++;
              }
            });
            if (dataCount > 0) {
              uprAuthGroup.selected = false;
            }
          }
        }
      }
    }

    if (sysCd) {
      return menus.filter((menu) => menu.sysCd === sysCd);
    }

    return menus;
  }

  /**
   * 권한 저장
   */
  async function save(auth: Auth) {
    const result = await api.call<apiModels.ApiResponse<Auth>>({
      url: "/api/system/authority",
      method: "POST",
      data: auth,
      timeout: 60000,
      passOnResponseCode: ["FM11"],
    });

    return result.data;
  }

  return { hasApprovalAuth, getAuthGroupInfo, getUserAuthInfo, save };
});
