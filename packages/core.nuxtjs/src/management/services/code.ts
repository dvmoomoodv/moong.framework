import { apiModels } from '#ustra/core/data'
import { defineUstraService } from '#ustra/nuxt/composables'
import { Code, CodeCriteria } from '../models/code'

/**
 * 코드 서비스
 */
export const useUstraCodeService = defineUstraService(({ api }) => {
  /**
   * 그룹 코드 목록 조회
   * @param criteria 검색 조건
   * @returns 그룹 코드 목록
   */
  async function getCodeGroups(criteria: CodeCriteria = {}) {
    const result = await api.call<apiModels.ApiResponse<Code[]>>({
      url: '/api/system/code/group/list',
      method: 'POST',
      data: criteria,
    })

    return result.data?.body
  }

  /**
   * 그룹 코드로 코드 목록 조회
   * @param grpCd 그룹 코드
   */
  async function getCodesByGroup(grpCd: string) {
    const param: apiModels.ApiRequest = {
      header: {},
      grpCds: [grpCd],
    }
    const result = await api.call<apiModels.ApiResponse<Code[]>>({
      url: '/api/system/code/group',
      method: 'POST',
      data: param,
    })

    return result.data.body
  }

  /**
   * 상위 코드로 코드 목록 조회
   * @param uprGrpCd 상위 그룹 코드
   * @param uprDtlCd 상휘 상세 코드
   * @returns 코드 목록
   */
  async function getCodeGroupDepth(uprGrpCd: string, uprDtlCd: string) {
    const param: apiModels.ApiRequest = {
      header: {},
      uprGrpCd,
      uprDtlCd,
    }
    const result = await api.call<apiModels.ApiResponse<Code[]>>({
      url: '/api/system/code/group/depth',
      method: 'POST',
      data: param,
    })

    return result.data.body
  }

  /**
   * 검색 조건으로 코드 목록 조회
   * @param criteria 검색 조건
   * @returns 코드 목록
   */
  async function getCodeList(criteria: CodeCriteria = {}) {
    const result = await api.call<apiModels.ApiResponse<Code[]>>({
      url: '/api/system/code/list',
      method: 'POST',
      data: criteria,
    })

    return result.data.body
  }

  /**
   * 코드 상세 정보 조회
   * @param grpCd 그룹 코드
   * @param dtlCd 상세 코드
   * @returns 코드 정보
   */
  async function getCode(grpCd: string, dtlCd: string) {
    const param: apiModels.ApiRequest = {
      header: {},
      grpCd,
      dtlCd,
    }
    const result = await api.call<apiModels.ApiResponse<Code>>({
      url: '/api/system/code/detail',
      method: 'POST',
      data: param,
    })

    return result.data?.body
  }

  /**
   * 코드 추가
   * @param code 코드 정보
   * @returns
   */
  async function addCode(code: Code) {
    const param: apiModels.ApiRequest = {
      header: {},
      code,
    }
    const result = await api.call<apiModels.ApiResponse<Code>>({
      url: '/api/system/code',
      method: 'POST',
      data: param,
    })

    return result.data?.body
  }

  /**
   * 코드 수정
   * @param code 코드 정보
   * @returns
   */
  async function modCode(code: Code) {
    delete code.updDttm
    delete code.updUsrId
    delete code.updUsrIp
    const param: apiModels.ApiRequest = {
      header: {},
      code,
    }
    const result = await api.call<apiModels.ApiResponse<Code>>({
      url: '/api/system/code/edit',
      method: 'POST',
      data: param,
    })

    return result.data.body
  }

  /**
   * 코드 제거
   * @param grpCd 그룹 코드
   * @param dtlCd 상세 코드
   * @returns
   */
  async function delCode(grpCd: string, dtlCd: string) {
    const param: apiModels.ApiRequest = {
      header: {},
      grpCd,
      dtlCd,
    }
    const result = await api.call<apiModels.ApiResponse<Code>>({
      url: '/api/system/code/remove',
      method: 'POST',
      data: param,
    })

    return result.data.body
  }

  return { getCodeGroups, getCodesByGroup, getCodeGroupDepth, getCodeList, getCode, addCode, modCode, delCode }
})
