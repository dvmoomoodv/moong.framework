import { apiModels } from '#ustra/core/data'
import { defineUstraService } from '#ustra/nuxt/composables'
import { AuthGroup, AuthGroupCriteria, AuthGroupTreeData } from '../models/auth-group'

/**
 * 권한 그룹 서비스
 */
export const useUstraAuthGroupService = defineUstraService(({ $ustra, api }) => {
  /**
   * 권한 그룹 목록 조회
   * @param creteria 조건
   */
  async function getAuthGroups(criteria: AuthGroupCriteria = {}) {
    const res = await api.call<apiModels.ApiResponse<AuthGroup[]>>({
      url: '/api/system/auth-group/list',
      method: 'POST',
      data: criteria,
    })

    const findAuthGroupById = (authGroups: AuthGroupTreeData[], authGrpId: number): AuthGroupTreeData => {
      if (!authGroups) {
        return null
      }

      for (const authGroup of authGroups) {
        if (authGroup.authGrpId === authGrpId) {
          return authGroup
        }

        const subAuthGroup = findAuthGroupById(authGroup.items, authGrpId)
        if (subAuthGroup) {
          return subAuthGroup
        }
      }
    }

    const authGroups: AuthGroupTreeData[] = []
    for (const ag of res.data.body) {
      const treeAuthGroup: AuthGroupTreeData = ag
      treeAuthGroup.items = []
      treeAuthGroup.expanded = true
      treeAuthGroup.icon = 'user'
      treeAuthGroup.selected = false
      treeAuthGroup.disabled = false

      if (!treeAuthGroup.uprAuthGrpId) {
        authGroups.push(treeAuthGroup)
        treeAuthGroup.icon = 'group'
      } else {
        const uprAuthGroup = findAuthGroupById(authGroups, treeAuthGroup.uprAuthGrpId)

        if (uprAuthGroup) {
          uprAuthGroup.items.push(treeAuthGroup)
          uprAuthGroup.icon = 'group'
        }
      }
    }

    return authGroups
  }

  /**
   * 권한 그룹 목록 조회
   * @param creteria 조건
   */
  async function getAuthGroupsAsList(criteria: AuthGroupCriteria = {}) {
    const res = await api.call<apiModels.ApiResponse<AuthGroup[]>>({
      url: '/api/system/auth-group/list',
      method: 'POST',
      data: criteria,
    })

    return res.data.body
  }

  /**
   * 사용자가 요청 가능한 권한 그룹 목록 조회
   * @param sysCd 시스템 코드
   * @param usrId 사용자 아이디
   */
  async function getRequestableGroupsOfUser(sysCd: string, usrId: string) {
    const url = api.urlBuilder('/api/system/auth-group/requestable').add('sysCd', sysCd).add('usrId', usrId).build()

    const result = await api.call<apiModels.ApiResponse<AuthGroup[]>>({
      url,
      method: 'GET',
    })

    return result.data.body
  }

  /**
   * 권한 그룹 상세 정보 조회
   * @param authGrpId 권한 그룹 아이디
   */
  async function getAuthGroup(authGrpId: number) {
    const result = await api.call<apiModels.ApiResponse<AuthGroup>>({
      url: `/api/system/auth-group/${authGrpId}`,
      method: 'GET',
    })

    return result.data.body
  }

  /**
   * 권한 그룹 추가
   * @param authGroup
   */
  async function add(authGroup: AuthGroup) {
    authGroup = $ustra.utils.model.removeSystemField(authGroup)

    const result = await api.call<apiModels.ApiResponse<AuthGroup>>({
      url: '/api/system/auth-group',
      method: 'POST',
      data: authGroup,
      passOnResponseCode: ['FM11'],
    })

    return result?.data
  }

  /**
   * 권한 그룹  변경
   * @param authGroup
   */
  async function edit(authGroup: AuthGroup) {
    authGroup = $ustra.utils.model.removeSystemField(authGroup)

    const result = await api.call<apiModels.ApiResponse<AuthGroup>>({
      url: '/api/system/auth-group/edit',
      method: 'POST',
      data: authGroup,
      passOnResponseCode: ['FM11'],
    })

    return result?.data
  }

  /**
   * 권한 그룹 삭제
   * @param authGroup
   */
  async function remove(authGroup: AuthGroup) {
    const result = await api.call<apiModels.ApiResponse<AuthGroup>>({
      url: '/api/system/auth-group/remove',
      method: 'POST',
      data: authGroup,
      passOnResponseCode: ['FM11'],
    })

    return result.data
  }

  /**
   * 하위 권한 그룹 체크
   * @param authGrpId
   */
  async function childGroupCheck(authGrpId: number) {
    const param: apiModels.ApiRequest = {
      header: {},
      authGrpId,
    }
    const result = await api.call<apiModels.ApiResponse<AuthGroup>>({
      url: '/api/system/auth-group/child',
      method: 'POST',
      data: { authGrpId },
    })

    return result?.data?.body
  }

  /**
   * 권한 그룹 사용자 등록
   * @param usrId 사용자 아이디
   * @param authGrpIds 권한 그룹 목록
   */
  async function registerUsers(usrId: string, authGrpIds: number[]) {
    const url = api.urlBuilder('/api/system/auth-group/register-users').add('usrId', usrId).addBase64('authGrpIds', authGrpIds).build()

    const result = await api.call<apiModels.ApiResponse<number>>({
      url,
      method: 'POST',
      passOnResponseCode: ['FM11'],
      responseType: 'json',
    })

    return result.data
  }

  return { getAuthGroups, getRequestableGroupsOfUser, getAuthGroupsAsList, getAuthGroup, add, edit, remove, childGroupCheck, registerUsers }
})
