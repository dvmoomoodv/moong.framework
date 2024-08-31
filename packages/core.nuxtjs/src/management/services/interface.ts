import { Ifs, IfsCriteria, IfsChnl, IfsHist, IfsKey, IfsHistCriteria } from '../models/interfaces'
import { apiModels } from '#ustra/core/data'
import { defineUstraService } from '#ustra/nuxt/composables'

/**
 * 프레임워크 인터페이스 서비스
 */
export const useUstraInterfaceService = defineUstraService(({ api }) => {
  /**
   * 인터페이스 목록 조회
   * @param criteria 검색 조건
   * @returns 인터페이스 목록
   */
  async function getInterfaces(criteria?: IfsCriteria) {
    return (
      await api.call<apiModels.ApiResponse<Ifs[]>>({
        url: '/api/system/ifs/list',
        method: 'POST',
        data: criteria,
      })
    )?.data?.body
  }

  /**
   * 인터페이스 상세 정보 조회
   * @param id 인터페이스 아이디
   * @param ver 인터페이스 버전
   * @returns 인터페이스 상세 정보
   */
  async function getInterface(id: string, ver: string) {
    return (
      await api.call<apiModels.ApiResponse<Ifs>>({
        url: '/api/system/ifs/detail',
        method: 'POST',
        data: {
          ifId: id,
          ifVer: ver,
        },
      })
    )?.data?.body
  }

  /**
   * 인터페이스 정보 추가
   * @param ifs 인터페이스 정보
   * @returns
   */
  async function addInterface(ifs: Ifs) {
    const param: apiModels.ApiRequest = {
      header: {},
      ifs,
    }
    return (
      await api.call<apiModels.ApiResponse<Ifs>>({
        url: '/api/system/ifs',
        method: 'POST',
        data: param,
      })
    )?.data?.body
  }

  /**
   * 인터페이스 정보 수정
   * @param ifs 인터페이스 정보
   * @returns
   */
  async function editInterface(ifs: Ifs) {
    const param: apiModels.ApiRequest = {
      header: {},
      ifs,
    }
    return (
      await api.call<apiModels.ApiResponse<Ifs>>({
        url: '/api/system/ifs/edit',
        method: 'POST',
        data: param,
      })
    )?.data?.body
  }

  /**
   * 인터페이스 정보 제거
   * @param id 아이디
   * @param ver 버전
   */
  async function removeInterface(id: string, ver: string) {
    const param: apiModels.ApiRequest = {
      header: {},
      ifId: id,
      ifVer: ver,
    }
    return (
      await api.call<apiModels.ApiResponse<Ifs>>({
        url: '/api/system/ifs/remove',
        method: 'POST',
        data: param,
      })
    )?.data?.body
  }

  /**
   * 인터페이스 이력 목록 조회
   * @param criteria 조회 조건
   * @returns
   */
  async function getIntefaceHistories(criteria?: Partial<IfsHistCriteria>) {
    return (
      await api.call<apiModels.ApiResponse<IfsHist[]>>({
        url: '/api/system/ifshist/list',
        method: 'POST',
        // data: criteria,
        data: {
          header: {
            ...criteria.header,
          },
          searchValue: criteria.searchValue,
        },
      })
    )?.data
  }

  /**
   * 인터페이스 이력 상세 정보 조회
   * @param histId 이력 아이디
   * @returns 인터페이스 이력 정보
   */
  async function getInterfaceHistory(histId: number) {
    return (
      await api.call<apiModels.ApiResponse<IfsHist>>({
        url: '/api/system/ifshist/detail',
        method: 'POST',
        data: {
          ifHistId: histId,
        },
      })
    )?.data?.body
  }

  return { getInterfaces, getInterface, addInterface, editInterface, removeInterface, getIntefaceHistories, getInterfaceHistory }
})
