import { ref } from "vue";
import { onNuxtReady, showError } from "#app";
import { defineInitStore } from "#moong/nuxt/store";
import { Code, FileGrp, Menu } from "#moong/nuxt/management";
import { useUstra } from "#moong/nuxt/composables";
import { useSessionStorage, StorageSerializers } from "@vueuse/core";
import {
  ServerAppProps,
  InitialData,
  useUstraInitialDataService,
} from "../services/common/initial-data";
import toUpper from "lodash/toUpper";
import { useLogger } from "#moong/nuxt/utils/logger";

const logger = useLogger("ustra:management");

// 초기 데이터 캐시
const initialCacheData = useSessionStorage<InitialData>(
  "ustra:initial-data",
  null,
  {
    serializer: StorageSerializers.object,
  }
);

/**
 * 초기 데이터 스토어
 */
export const useUstraInitDataStore = defineInitStore(
  "ustra:management:initData",
  () => {
    const $ustra = useUstra();

    const state = {
      /**
       * 서버 어플리케이션 Property
       */
      serverAppProps: ref<ServerAppProps>(null),

      /**
       * 공통 코드 목록
       */
      commonCodes: ref<Map<string, Code[]>>(new Map<string, Code[]>()),

      /**
       * 프로젝트 프로퍼티
       */
      projectProps: ref<any>(null),

      /**
       * 현재 시스템 코드
       */
      currentSystemCode: ref<string>(null),

      /**
       * 코드 매핑 룰
       */
      codeMappingRules: ref<Map<string, string>>(new Map<string, string>()),

      /**
       * 파일 그룹 목록
       */
      fileGroups: ref<FileGrp[]>([]),

      /**
       * 프로그램 메뉴 목록
       */
      programMenus: ref<Menu[]>([]),
    };

    /**
     * 공통 코드 목록 반영
     * @param codes
     */
    function setCommonCodes(codes: Code[]) {
      const commonCodes = new Map<string, Code[]>();
      for (const code of codes) {
        if (code.dtlCd === "*") {
          continue;
        }

        const grpCd = toUpper(code.grpCd);

        if (commonCodes.has(grpCd)) {
          commonCodes.get(grpCd).push(Object.freeze(code));
        } else {
          commonCodes.set(grpCd, [Object.freeze(code)]);
        }
      }

      state.commonCodes.value = commonCodes;
    }

    /**
     * code mapping rule 적용
     * @param codeMappingRules
     */
    function setCodeMappingRules(codeMappingRules: Record<string, string>) {
      const codeMappingRuleMap = new Map<string, string>();
      for (const key in codeMappingRules) {
        codeMappingRuleMap.set(key, codeMappingRules[key]);
      }
      state.codeMappingRules.value = codeMappingRuleMap;
    }

    /**
     * 초기 데이터 조회
     * @param type
     */
    async function initData(type: "all" | "code" | "menu" | "prop") {
      const initialDataService = useUstraInitialDataService();
      let initData: InitialData = null;

      if (!initData) {
        initData = await initialDataService.getInitialData();
      }

      if (type === "all" || type === "code") {
        setCommonCodes(initData.commonCodes);
        setCodeMappingRules(initData.codeMappingRules);
      }

      if (type === "all" || type === "menu") {
        state.programMenus.value = initData.menus;
      }

      if (type === "all" || type === "prop") {
        state.serverAppProps.value = initData.appProp;
        state.projectProps.value = initData.projectProp;
        state.fileGroups.value = initData.fileGroups;
      }

      // 캐시 사용 여부 세팅
      const useCache = $ustra.env.appProps.nuxt.management.initialData.useCache;
      if (useCache) {
        initialCacheData.value = initData;
      }
    }

    /**
     * 메뉴 full name을 조회
     * @param id
     * @returns
     */
    function getMenuFullName(id: string) {
      if (!state.programMenus.value) {
        return null;
      }

      let currentMenu = state.programMenus.value.find(
        (menu) => menu.mnuId === id
      );
      if (!currentMenu) {
        return null;
      }

      const menuNames = [];

      while (!!currentMenu) {
        menuNames.unshift(currentMenu.mnuNm);
        if (!currentMenu.uprMnuId) {
          break;
        }

        currentMenu = state.programMenus.value.find(
          (menu) => menu.mnuId === currentMenu.uprMnuId
        );
      }

      return menuNames.join(" > ");
    }

    /**
     * 초기 데이터를 로드한다.
     */
    async function loadInitialData() {
      try {
        const useCache =
          $ustra.env.appProps.nuxt.management.initialData.useCache;
        let isCachedData = false;

        let initialData: InitialData = null;
        if (useCache) {
          initialData = initialCacheData.value;
          isCachedData = true;
        }

        if (!initialData) {
          const service = useUstraInitialDataService();
          initialData = await service.getInitialData();
        }

        setCommonCodes(initialData.commonCodes);
        state.serverAppProps.value = initialData.appProp;
        state.projectProps.value = initialData.projectProp;
        setCodeMappingRules(initialData.codeMappingRules);
        state.currentSystemCode.value = initialData.currentSystemCode;
        state.programMenus.value = initialData.menus;
        state.fileGroups.value = initialData.fileGroups;

        state.codeMappingRules.value.clear();

        // call hook management:initial-data:loaded
        $ustra.hooks.callHook("management:initial-data:loaded", {
          sourceType: isCachedData ? "cached" : "realtime",
          data: initialData,
        });

        initialCacheData.value = initialData;
      } catch (e) {
        logger.error(e.message, e);
        $ustra.hooks.callHook("management:initial-data:error", e);

        throw showError({
          statusCode: 500,
          fatal: true,
          message:
            "초기 데이터 조회 중 오류가 발생하였습니다. 브라우저를 리로드하여 재 기동해주시기 바랍니다. 오류가 계속될 경우 관리자에게 문의 해주세요.",
        });

        // $ustra.ui.dialog.alert(
        //   '초기 데이터 조회 중 오류가 발생하였습니다. 브라우저를 새로그침 해주시고, 오류가 계속될 경우 관리자에게 문의해주시기 바랍니다.',
        // )
      }
    }

    return {
      ...state,
      setCommonCodes,
      initData,
      setCodeMappingRules,
      getMenuFullName,
      loadInitialData,
    };
  },
  async (store, { appProps, $ustra }) => {
    // 초기 데이터 조회 시점 변경
    // onNuxtReady(async () => {
    await store.loadInitialData();
    // })
  }
);
