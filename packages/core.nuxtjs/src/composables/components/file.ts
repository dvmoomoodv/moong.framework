import {
  reactive,
  ref,
  watch,
  watchEffect,
  nextTick,
  useDeepMerge,
} from "#moong/nuxt";
import { useVModel } from "@vueuse/core";
import { FileOutput, FileMetaData, FileGrp } from "#moong/nuxt/management";
import { apiModels } from "#moong/core/data";
import toString from "lodash/toString";
import type { I18nMessage } from "#moong/core/config/props/i18n";

/**
 * 연계 API URL
 */
export const definedApiUrl = {
  /**
   * 목록 조회
   */
  list: "/api/file/list",

  /**
   * 리소스 변환
   */
  convert: "/api/file/convert/resource",

  /**
   * 리소스 메타 데이터
   */
  convertFromMetaData: "/api/file/convert/metaData",

  /**
   * 업로드
   */
  upload: "/api/file/upload",

  /**
   * 삭제
   */
  remove: "/api/file/remove",
};

/**
 * 메시지 유형
 */
export type CustomMessage = {
  /**
   * 파일 그룹 조회 실패 메시지
   */
  "ustra.file.notFoundFileGroup"?: string;

  /**
   * 파일 용량 초과 메시지
   */
  "ustra.file.fileLimitExceeded"?: string;

  /**
   * 파일 조회 실패 메시지
   */
  "ustra.file.errorOnRetrievingFile"?: string;

  /**
   * 파일 Resource Not Found 실패 메시지
   */
  "ustra.file.cannotFoundFile"?: string;

  /**
   * 업로드 오류 메시지
   */
  "ustra.file.errorOnUploadFile"?: string;

  /**
   * 다운로드 오류 메시지
   */
  "ustra.file.errorOnDownloadFile"?: string;
};

/**
 * File 컴포넌트 기본 Props 정의
 */
export interface FileUploadComponentProps {
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
}

/**
 * 파일 업로드 컴포넌트 정의
 * @param props property
 * @param reloadHandler reload 시 처리할 내용
 * @returns
 */
export const defineUstraFileUploaderComponent = (
  props: FileUploadComponentProps,
  options: {
    /**
     * 파일 리로드 시 처리 핸들러
     */
    reloadHandler?: Function;

    /**
     * 파일 그룹 조회 핸들러
     */
    findFileGroup: (fileGrpId: string) => FileGrp | null;

    /**
     * custom 메시지
     */
    messages?: CustomMessage;
  }
) => {
  const apiUrls = $ustra.utils.core.deepMerge(
    {},
    definedApiUrl,
    props.apiUrls || {}
  );
  const messages = $ustra.message.mergeMessageObject(options.messages);

  //#region 조회 조건 영역
  const fileGroupCondition = reactive({
    maxFileSize: 0,
    accept: "*/*",
  });

  const disabled = ref(true);

  watchEffect(() => {
    if (props.fileGroupId) {
      const fileGroup = options.findFileGroup(props.fileGroupId);

      if (!fileGroup) {
        disabled.value = true;
        throw new Error(
          $ustra.utils.string.format(
            messages["ustra.file.notFoundFileGroup"],
            props.fileGroupId
          )
        );
        // throw new Error('존재하지 않는 파일 그룹입니다. : ' + props.fileGroupId)
      }

      fileGroupCondition.maxFileSize = fileGroup.maxSz;
      fileGroupCondition.accept = fileGroup.extenLmt || "*/*";
      disabled.value = false;
    }
  });
  //#endregion

  const fileId = useVModel(props, "fileId");
  const selectedFiles = ref<File[]>([]);
  const uploadedFiles = ref<FileMetaData[]>([]);

  watch(
    fileId,
    () => {
      if (fileId.value) {
        if (props.autoLoadFileInfo) {
          nextTick().then(() => load());
        } else {
          nextTick().then(() => init());
        }
      } else {
        nextTick().then(() => init());
      }
    },
    {
      immediate: true,
    }
  );

  /**
   * 파일 추가
   * @param files
   * @param init 초기화 여부
   * @returns
   */
  function addFile(files: File[], init = false) {
    // validate
    for (const file of files) {
      if (
        fileGroupCondition.maxFileSize > 0 &&
        fileGroupCondition.maxFileSize < file.size
      ) {
        alert(
          $ustra.utils.string.format(
            messages["ustra.file.fileLimitExceeded"],
            file.name,
            $ustra.utils.formatting.fileSize(fileGroupCondition.maxFileSize)
          )
        );
        // alert(
        //   '파일 허용 용량을 초과하였습니다 : ' +
        //     file.name +
        //     '\n' +
        //     '최대 업로드 가능 용량은 "' +
        //     $ustra.utils.formatting.fileSize(fileGroupCondition.maxFileSize) +
        //     '" 입니다.',
        // )
        return;
      }
    }

    if (init) {
      selectedFiles.value = [];
    }

    selectedFiles.value.push(...files);
    if (options.reloadHandler) {
      options.reloadHandler();
    }
  }

  /**
   * 초기화
   */
  function init() {
    selectedFiles.value = [];
    uploadedFiles.value = [];

    if (options.reloadHandler) {
      options.reloadHandler();
    }
  }

  /**
   * 업로드 파일 조회
   */
  async function load() {
    if (!fileId.value) {
      init();
      return;
    }

    try {
      selectedFiles.value = [];
      const res = await $ustra.api.call<apiModels.ApiResponse<FileOutput>>({
        url: apiUrls.list,
        method: "POST",
        data: {
          fileGrpId: props.fileGroupId,
          fileId: fileId.value,
        },
      });

      uploadedFiles.value = res.data.body.fileMetaDatas;
      if (options.reloadHandler) {
        options.reloadHandler();
      }
    } catch (err) {
      alert(
        $ustra.utils.string.format(messages["ustra.file.errorOnRetrievingFile"])
      );
      throw err;
    }
  }

  /**
   * 다운로드
   * @param fileNo 파일 번호
   */
  function download(fileNo: number = undefined) {
    const fileNos = [];
    if (fileNo) {
      fileNos.push(fileNo);
    } else {
      fileNos.push(...uploadedFiles.value.map((r) => r.fileNo));
    }

    fileNos.forEach((fileNo) => {
      const fileInfo = uploadedFiles.value.find((f) => f.fileNo === fileNo);

      if (!fileInfo) {
        alert(
          $ustra.utils.string.format(messages["ustra.file.cannotFoundFile"])
        );
        return;
      }

      try {
        const url = $ustra.api
          .urlBuilder("/api/file/attach")
          .add("fileGrpId", props.fileGroupId)
          .add("fileId", fileId.value)
          .add("fileNo", fileNo)
          .add("attachmentFileName", fileInfo.orgName)
          // .add('attachmentFileName', '1')
          .add("attach", "1")
          .build();

        $ustra.api.downloadFile({
          url,
          method: "GET",
          fileName: fileInfo.orgName,
          failMessage: messages["ustra.file.errorOnDownloadFile"],
        });
      } catch (e) {
        alert(
          $ustra.utils.string.format(messages["ustra.file.errorOnDownloadFile"])
        );
      }
    });
  }

  /**
   * form data를 생성한다.
   */
  function createFormData() {
    const formData: FormData = new FormData();
    formData.append("fileGrpId", props.fileGroupId);
    formData.append("fileId", fileId.value || "");

    if (props.subDir) {
      formData.append("subDir", props.subDir);
    }

    let index = 1;
    uploadedFiles.value.forEach((f) => {
      formData.append(`file-${index}`, f.fileNo.toString());
      index++;
    });

    selectedFiles.value.forEach((f) => {
      formData.append(`file-${index}`, f);
      index++;
    });

    return formData;
  }

  /**
   * 파일 업로드
   */
  async function upload() {
    const formData = createFormData();

    if (props.beforeUpload) {
      const arg = {
        formData,
        cancel: false,
      };
      await props.beforeUpload(arg);

      if (arg.cancel === true) {
        return;
      }
    }

    try {
      const result = await $ustra.api.call<apiModels.ApiResponse<FileOutput>>({
        url: apiUrls.upload,
        method: "POST",
        headers: {
          contentType: false,
          processData: false,
          enctype: "multipart/form-data",
        },
        data: formData,
        timeout: 0,
        showLoadingBar: false,

        onUploadProgress(event) {
          $ustra.hooks.callHook("ui:progress", {
            type: "progress",
            show: true,
            progressRate: Math.round(event.progress * 100),
          });

          if (event.progress === 1) {
            setTimeout(() => {
              $ustra.hooks.callHook("ui:progress", {
                type: "progress",
                show: false,
                progressRate: 100,
              });
            }, 1000);
            return;
          }
        },
      });

      if (result.data.body.fileId) {
        fileId.value = result.data.body.fileId;
      }

      init();
      uploadedFiles.value = result.data.body.fileMetaDatas;
      if (options.reloadHandler) {
        options.reloadHandler();
      }

      return {
        fileId: result.data.body.fileId,
        fileMetaDatas: result.data.body.fileMetaDatas,
        success: result.data.resultCode === "0000",
        convertData: null,
      };
    } catch (err) {
      $ustra.hooks.callHook("ui:progress", {
        type: "progress",
        show: false,
        progressRate: 0,
      });

      alert(
        $ustra.utils.string.format(messages["ustra.file.errorOnUploadFile"])
      );
      throw err;
    }
  }

  /**
   * 리소스를 파일 변환 처리
   * @param fileType 파일 유형
   * @paramn formDataConverter formData를 커스토마이징할 수 있는 function
   * @param passOnResponseError 오류 발생 시, 통과 여부
   * @returns
   */
  async function convert(
    fileType: "excel" | "image" | "text",
    formDataConverter?: (formData: FormData) => void,
    passOnResponseError?: boolean
  ) {
    try {
      let formData = createFormData();
      formData.append("convertedFileType", fileType);

      if (formDataConverter) {
        formDataConverter(formData);
      }

      const result = await $ustra.api.call<apiModels.ApiResponse<any>>({
        url: apiUrls.convert,
        method: "POST",
        headers: {
          contentType: false,
          processData: false,
          enctype: "multipart/form-data",
        },
        data: formData,
        timeout: 0,
        passOnResponseError,
      });

      return {
        fileId: fileId.value,
        fileMetaDatas: uploadedFiles.value,
        success: result.data.resultCode === "0000",
        convertData: result.data.body,
      };
    } catch (err) {
      alert(
        $ustra.utils.string.format(messages["ustra.file.errorOnUploadFile"])
      );
      throw err;
    }
  }

  /**
   * 메타 데이터로 데이터 변환 처리
   * @param convertedFileType 변환 유형
   * @param data 전송 데이터 객체
   * @param passOnResponseError 오류 발생 시, 통과 여부
   */
  async function convertFormMetaData(
    convertedFileType: "excel" | "image" | "text",
    data?: Record<string, any>,
    passOnResponseError?: boolean
  ) {
    try {
      const defaultData = {
        convertedFileType,
        fileGrpId: props.fileGroupId,
        fileId: fileId.value,
        fileMetaDatas: uploadedFiles.value,
      };

      const result = await $ustra.api.call<apiModels.ApiResponse<FileOutput>>({
        url: apiUrls.convertFromMetaData,
        method: "POST",
        data: $ustra.utils.core.deepMerge(defaultData, data || {}),
        timeout: 0,
        passOnResponseError,
      });

      return {
        fileId: fileId.value,
        fileMetaDatas: uploadedFiles.value,
        success: result.data.resultCode === "0000",
        convertData: result.data.body,
      };
    } catch (err) {
      alert(
        $ustra.utils.string.format(messages["ustra.file.errorOnUploadFile"])
      );
      throw err;
    }
  }

  /**
   * 파일 업로드 및 변환 처리
   * @passOnResponseError 오류 발생 시, pass 여부
   */
  async function uploadExcel(
    passOnResponseError: boolean = false,
    options: {
      /**
       * resource 저장 필요 여부
       * @default false
       */
      storeResource?: boolean;

      /**
       * 오류 발생 시 중지 여부
       * @default false
       */
      stopOnError?: boolean;

      /**
       * 모델로 변환 시 Java 클래스 명
       */
      modelClassName?: string;

      /**
       * header row의 index
       * @default 0
       */
      headerRowIndex?: number;

      /**
       * 엑셀 업로드 후처리 Bean 명
       */
      excelDataPostProcessorBeanName?: string;

      /**
       * 엑셀 데이터 후처리기 전송 파라메터
       */
      excelDataPostProcessorParameter?: string | object;

      /**
       * 다중 sheet 리딩 시 index 또는 sheet 명
       */
      sheetNamesOrIndexes?: (string | number)[];

      /**
       * 엑셀 조회 시, 비밀번호
       */
      password?: string;
    } = {}
  ) {
    options = useDeepMerge(
      {
        storeResource: false,
        stopOnError: false,
        headerRowIndex: 0,
      },
      options
    );

    if (!options.storeResource) {
      return convert(
        "excel",
        (formData) => {
          const excelDataPostProcessorParameter =
            options.excelDataPostProcessorParameter || {};

          if (typeof excelDataPostProcessorParameter === "object") {
            excelDataPostProcessorParameter["fileId"] = props.fileId;
            excelDataPostProcessorParameter["fileMetaDatas"] =
              uploadedFiles.value;
          }

          formData.append("stopOnError", options.stopOnError.toString());

          if (options.modelClassName) {
            formData.append("modelClassName", options.modelClassName);
          }

          if (options.excelDataPostProcessorBeanName) {
            formData.append(
              "excelDataPostProcessorBeanName",
              options.excelDataPostProcessorBeanName
            );
          }

          if (options.excelDataPostProcessorParameter) {
            formData.append(
              "excelDataPostProcessorParameter",
              JSON.stringify(excelDataPostProcessorParameter)
            );
          }

          if (options.sheetNamesOrIndexes) {
            formData.append(
              "sheetNamesOrIndexes",
              JSON.stringify(options.sheetNamesOrIndexes)
            );
          } else {
            formData.append("sheetNamesOrIndexes", "[]");
          }

          if (!$ustra.utils.core.isEmpty(options.headerRowIndex)) {
            formData.append("headerRowIndex", toString(options.headerRowIndex));
          }

          if (!$ustra.utils.core.isEmpty(options.password)) {
            formData.append("password", options.password);
          }
        },
        passOnResponseError
      );
    } else {
      if (selectedFiles.value.length > 0) {
        await upload();
      }

      if (uploadedFiles.value.length > 0) {
        const excelDataPostProcessorParameter =
          options.excelDataPostProcessorParameter || {};

        if (typeof excelDataPostProcessorParameter === "object") {
          excelDataPostProcessorParameter["fileId"] = props.fileId;
          excelDataPostProcessorParameter["fileMetaDatas"] =
            uploadedFiles.value;
        }

        return convertFormMetaData(
          "excel",
          {
            stopOnError: options.stopOnError,
            modelClassName: options.modelClassName,
            sheetNamesOrIndexes: options.sheetNamesOrIndexes,
            headerRowIndex: options.headerRowIndex,
            password: options.password,
            excelDataPostProcessorBeanName:
              options.excelDataPostProcessorBeanName,
            excelDataPostProcessorParameter: JSON.stringify(
              excelDataPostProcessorParameter
            ),
          },
          passOnResponseError
        );
      }
    }
  }

  return {
    /**
     * 파일 그룹 조건
     */
    fileGroupCondition,

    /**
     * 비활성화 여부
     */
    disabled,

    /**
     * 파일 아이디
     */
    fileId,

    /**
     * API URL 목록
     */
    apiUrls,

    /**
     * 사용자가 선택한 파일 목록
     */
    selectedFiles,

    /**
     * 업로드 파일 목록
     */
    uploadedFiles,

    /**
     * 파일 추가
     */
    addFile,

    /**
     * 초기화
     */
    init,

    /**
     * 파일 정보 조회
     */
    load,

    /**
     * 다운로드
     */
    download,

    /**
     * Form Data 생성
     */
    createFormData,

    /**
     * 업로드
     */
    upload,

    /**
     * 엑셀 업로드
     */
    uploadExcel,

    /**
     * 파일 변환
     */
    convert,

    /**
     * 메타데이터 파일 변환
     */
    convertFormMetaData,
  };
};
