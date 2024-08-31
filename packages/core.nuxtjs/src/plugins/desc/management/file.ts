import { FileOutput } from "#moong/nuxt/management";
import { apiModels } from "#moong/core/data";

/**
 * 백 오피스 파일
 */
export class UstraManagmentFile {
  /**
   * 파일을 조회할 수 있는 URL을 반환한다.
   * @param fileId 파일 아이디
   * @param fileNo 파일 번호
   * @param fileGroupId 파일 그룹 아이디
   */
  getViewUrl(fileId: string, fileNo: number = 1, fileGroupId?: string) {
    return $ustra.api
      .urlBuilder("/api/file/attach")
      .add("fileId", fileId)
      .add("fileNo", fileNo)
      .add("attachmentFileName", "1")
      .add("attach", "0")
      .add("fileGrpId", fileGroupId || "ustra")
      .build();
  }

  /**
   * web 서버에서 접근 가능한 URL을 조회
   * @param fileId 파일 아이디
   * @param fileNo 파일 번호
   * @param fileGroupId 파일 그룹 아이디
   */
  async getWebAccessUrl(fileId, fileNo: number, fileGroupId: string) {
    const result = (
      await $ustra.api.call<apiModels.ApiResponse<FileOutput>>({
        url: "/api/file/list",
        method: "POST",
        data: {
          fileId,
          fileNos: [fileNo],
          fileGrpId: fileGroupId,
          includeAddtionalFiles: true,
        },
      })
    )?.data?.body;

    if (result?.fileMetaDatas?.length > 0) {
      return result.fileMetaDatas[0].accessUrl;
    }

    return null;
  }

  /**
   * 단일 파일을 업로드 한다.
   * @param fileGroupId 파일 그룹 아이디
   * @param fileId 파일 아이디 (공백일 경우, 신규)
   * @param file 파일 객체 (null일 경우 업로드하지 않음.)
   */
  async upload(fileGroupId: string, fileId: string, file: File) {
    const formData: FormData = new FormData();
    formData.append("fileGrpId", fileGroupId);
    formData.append("fileId", fileId || "");

    if (file) {
      formData.append("file-1", file);
    }

    const result = await $ustra.api.call<apiModels.ApiResponse<FileOutput>>({
      url: "/api/file/upload",
      method: "POST",
      headers: {
        contentType: false,
        processData: false,
        enctype: "multipart/form-data",
      },
      data: formData,
      timeout: 0,
    });

    return {
      fileId: result.data.body.fileId,
      fileMetaDatas: result.data.body.fileMetaDatas,
      success: result.data.resultCode === "0000",
      convertData: null,
    };
  }
}
