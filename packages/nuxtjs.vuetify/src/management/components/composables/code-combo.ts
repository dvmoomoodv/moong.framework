import { ExtractPropTypes } from "vue";
import { computed, useUstraUtils } from "#moong/nuxt";
import { useUstraCodeList } from "#moong/nuxt/management/composables";
import { Code } from "#moong/nuxt/management";
import { useVModel } from "@vueuse/core";

export interface CodeItem extends Code {
  /**
   * value 값
   */
  value?: string;

  /**
   * display 값
   */
  display?: string;
}

export interface CodeComboBoxProps {
  /**
   * 그룹 코드
   */
  grpCd: string;

  /**
   * 사용 중인 코드 값만 조회 여부
   */
  onlyUse?: boolean;

  /**
   * 코드 디스플레이 여부
   */
  displayCode?: boolean;

  /**
   * 목록 커스토마이징 function
   */
  customizeItems?: (codes: CodeItem[]) => CodeItem[];

  /**
   * 이름 순 정렬 여부
   */
  sortByName?: boolean;

  /**
   * 코드 순 정렬 여부
   */
  sortByCode?: boolean;

  /**
   * null value text
   */
  displayNullText?: string;

  /**
   * object value
   */
  objectValue?: CodeItem;
}

export const useComboComponent = (
  props: Readonly<ExtractPropTypes<CodeComboBoxProps>>,
  options?: {
    /**
     * comboValue값 setting 시 후처리 핸들러
     */
    afterSetComboValue: (value: any) => void;
  }
) => {
  const objectValue = useVModel(props, "objectValue");

  // @ts-ignore
  const vmodelValue = useVModel(props, "modelValue");
  const comboValue = computed({
    get() {
      return vmodelValue.value;
    },
    set(v: any) {
      vmodelValue.value = v;

      if (options?.afterSetComboValue) {
        options.afterSetComboValue(v);
      } else {
        objectValue.value = !v
          ? null
          : itemsSource.value.find((s) => s.value === v);
      }
    },
  });

  const itemsSource = computed(() => {
    let codes: CodeItem[] = useUstraUtils()
      .core.deepMerge([], useUstraCodeList(props.grpCd))
      .filter((code) => !props.onlyUse || code.useYn === "Y")
      .map((code) => {
        code.value = code.dtlCd;
        code.display = code.cdNm;
        code.checked = false;

        if (props.displayCode) {
          code.display = `${code.dtlCd} : ${code.cdNm}`;
        }

        return code;
      });

    if (props.sortByName) {
      codes = codes.sort((a, b) =>
        !a.dtlCd
          ? -1
          : !b.dtlCd
            ? 1
            : !a.cdNm
              ? -1
              : !b.cdNm
                ? 1
                : a.cdNm > b.cdNm
                  ? 1
                  : a.cdNm === b.cdNm
                    ? 0
                    : -1
      );
    } else if (props.sortByCode) {
      codes = codes.sort((a, b) =>
        !a.dtlCd
          ? -1
          : !b.dtlCd
            ? 1
            : !a.dtlCd
              ? -1
              : !b.dtlCd
                ? 1
                : a.dtlCd > b.dtlCd
                  ? 1
                  : a.dtlCd === b.dtlCd
                    ? 0
                    : -1
      );
    }

    if (props.displayNullText) {
      codes.unshift({
        value: null,
        display: props.displayNullText,
      });
    }

    if (props.customizeItems) {
      codes = props.customizeItems(codes);
    }

    return codes;
  });

  return { vmodelValue, comboValue, itemsSource, objectValue };
};
