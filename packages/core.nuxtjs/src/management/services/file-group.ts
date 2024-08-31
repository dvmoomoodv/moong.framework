import { FileGrp } from '../models/file'
import { apiModels } from '#ustra/core/data'
import { defineUstraService } from '#ustra/nuxt/composables'

export const useUstraFileGroupService = defineUstraService(({ api, $ustra }) => {
  /**
   * 파일 그룹 목록 조회
   * @param criteria
   * @returns
   */
  async function getFileGroups() {
    return (
      await api.call<apiModels.ApiResponse<FileGrp[]>>({
        url: '/api/system/filegrp/group',
        method: 'POST',
      })
    )?.data?.body
  }

  /**
   * 파일 그룹 상세 정보 조회
   * @param fileGrpId 파일 그룹 아이디
   */
  async function getFileGroup(fileGrpId: string) {
    return (
      await api.call<apiModels.ApiResponse<FileGrp>>({
        url: '/api/system/filegrp/detail',
        method: 'POST',
        data: {
          fileGrpId,
        },
      })
    )?.data?.body
  }

  /**
   * 파일 그룹 추가
   * @param fileGroup 파일 그룹 정보
   * @returns
   */
  async function add(fileGroup: FileGrp) {
    return (
      await api.call<apiModels.ApiResponse<FileGrp>>({
        url: '/api/system/filegrp',
        method: 'POST',
        data: {
          fileGrp: $ustra.utils.model.removeSystemField(fileGroup),
        },
      })
    )?.data?.body
  }

  /**
   * 파일 그룹 수정
   * @param fileGroup 파일 그룹 정보
   * @returns
   */
  async function edit(fileGroup: FileGrp) {
    return (
      await api.call<apiModels.ApiResponse<FileGrp>>({
        url: '/api/system/filegrp/edit',
        method: 'POST',
        data: {
          fileGrp: $ustra.utils.model.removeSystemField(fileGroup),
        },
      })
    )?.data?.body
  }

  /**
   * 파일 그룹 삭제
   * @param fileGrpId 파일 그룹 아이디
   * @returns
   */
  async function remove(fileGrpId: string) {
    return (
      await api.call<apiModels.ApiResponse<FileGrp>>({
        url: '/api/system/filegrp/remove',
        method: 'POST',
        data: {
          fileGrpId,
        },
      })
    )?.data?.body
  }

  return { getFileGroups, getFileGroup, add, edit, remove }
})
