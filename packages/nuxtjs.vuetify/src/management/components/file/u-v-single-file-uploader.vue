<template>
  <v-file-input
    label="파일명"
    :accept="fileGroupCondition.accept"
    show-size
    @change="onFileSelected"
    @click:clear="removeFile"
    v-model="fileId"
    :readonly="props.readonly"
    :roles="false"
  ></v-file-input>
</template>
<script lang="ts" setup>
import {
  defineProps,
  withDefaults,
  defineExpose,
  ref,
  defineEmits,
} from "#moong/nuxt";
import {
  definedApiUrl,
  defineUstraManagementFileUploaderComponent,
} from "#moong/nuxt/management/composables/components/file";
import { file } from "#moong/core/utils";
const fileId = ref(null);
const props = withDefaults(
  defineProps<{
    /**
     * 파일 그룹 아이디 (필수 값)
     */
    fileGroupId: string;

    /**
     * 편집 불가능 여부
     */
    readonly?: boolean;

    /**
     * 파일 아이디
     */
    fileId: string | null;

    /**
     * 저장할 하위 디렉토리 경로
     */
    subDir?: string;

    /**
     * 필수 여부
     */
    required?: boolean;

    /**
     * 업로드 전 발생 이벤트
     * cancel 값을  true로 리턴할 경우, 제외 가능
     */
    beforeUpload?: (args: {
      formData: FormData;
      cancel: boolean;
    }) => void | Promise<void>;

    /**
     * api URL 설정
     */
    apiUrls?: Partial<typeof definedApiUrl>;

    /**
     * 파일 아이디 변경 시 정보 자동 조회 여부
     * @default true
     */
    autoLoadFileInfo?: boolean;

    /**
     * 커스톰 메시지
     */
    messages?: CustomMessage;
  }>(),
  {
    readonly: false,
    required: false,
    autoLoadFileInfo: true,
  }
);

const emits = defineEmits<{
  /**
   * fileI 변경
   */
  (e: "update:fileId", fileId: string): void;

  /**
   * 파일 선택 시
   */
  (e: "selected", file: File): void;

  /**
   * 파일 삭제 시
   */
  (e: "removed"): void;
}>();

const {
  fileGroupCondition,
  selectedFiles,
  uploadedFiles,
  disabled,
  addFile,
  createFormData,
  download,
  upload,
} = defineUstraManagementFileUploaderComponent(props, {
  reloadHandler: () => {},
  messages: props.messages,
});

const onFileSelected = (fileInfo) => {
  let files: File[] = fileInfo.srcElement.files;
  if (!files) {
    return;
  }

  if (!file.validateFiiesAccepts(fileGroupCondition.accept, files)) {
    alert("허용된 파일 형식이 아닙니다.");
    return;
  }

  if (files.length < 1) {
    return;
  }

  addFile([files[0]], true);
  uploadedFiles.value = [];

  emits("selected", files[0]);
  console.log("완료");
};

function removeFile() {
  const occurRemoveEvent =
    uploadedFiles.value.length > 0 || selectedFiles.value.length > 0;

  selectedFiles.value = [];
  uploadedFiles.value = [];

  if (occurRemoveEvent) {
    emits("removed");
  }
}

defineExpose({
  createFormData,
  upload,
  /**
   * file 객체를 추가
   * @param file File 객체
   */
  addFile: (file: File) => {
    onFileSelected([file]);
  },
  /**
   * 파일 객체를 제거
   */
  removeFile,
});
</script>
<script lang="ts">
export default {
  name: "UVSingleFileUploader",
};
</script>
