import {
  defineUstraFileUploaderComponent,
  definedApiUrl,
  CustomMessage,
} from "#moong/nuxt/composables/components/file";
import type { FileUploadComponentProps } from "#moong/nuxt/composables/components/file";

/**
 * Management 파일 업로드 컴포넌트 정의
 * @param props property
 * @param reloadHandler reload 시 처리할 내용
 * @returns
 */
export const defineUstraManagementFileUploaderComponent = (
  props: FileUploadComponentProps,
  options: {
    /**
     * 파일 리로드 시 처리 핸들러
     */
    reloadHandler?: Function;

    /**
     * custom 메시지
     */
    messages?: CustomMessage;
  } = {}
) => {
  return defineUstraFileUploaderComponent(props, {
    findFileGroup(fileGrpId) {
      return $ustra.management.store.initData.fileGroups.find(
        (fg) => fg.fileGrpId === fileGrpId
      );
    },
    ...options,
  });
};
export { FileUploadComponentProps, definedApiUrl };
