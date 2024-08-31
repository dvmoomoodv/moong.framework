import { useUstra } from "#moong/nuxt/composables";
import { core } from "#moong/core/utils";

function getMappedGrpCode(grpCd: string) {
  const $ustra = useUstra();
  const store = $ustra.management.store.initData;

  grpCd = grpCd.toUpperCase();

  if (store.codeMappingRules.has(grpCd)) {
    return store.codeMappingRules.get(grpCd);
  }

  return grpCd;
}

/**
 * 코드 목록 조회
 * @param grpCd 그룹 코드
 * @param onlyUseable 사용 중인 코드만 조회
 * @returns 코드 목록
 */
export const useUstraCodeList = (grpCd: string, onlyUseable = false) => {
  if (!grpCd) {
    return [];
  }

  const $ustra = useUstra();
  grpCd = getMappedGrpCode(grpCd);

  const codes = (
    $ustra.management.store.initData.commonCodes.get(grpCd) || []
  ).map((code) => core.deepMerge({}, code));

  return !onlyUseable ? codes : codes.filter((code) => code.useYn === "Y");
};

/**
 * 코드 value 값 조회
 * @param grpCd 그룹 코드
 * @param dtlCd 상세 코드
 * @returns 코드 value
 */
export const useUstraCodeValue = (grpCd: string, dtlCd: string) => {
  const codes = useUstraCodeList(grpCd);

  const code = codes.find((code) => code.dtlCd === dtlCd);

  if (!code) {
    return null;
  }

  return code.cdNm;
};
