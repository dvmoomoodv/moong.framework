import { apiModels } from '#ustra/core/data'
import { defineUstraService } from '#ustra/nuxt/composables'
import { Code, Menu, FileGrp } from '#ustra/nuxt/management'

/**
 * 서버 어플리케이션 프로퍼티
 */
export interface ServerAppProps {
  /**
   * 최대 메뉴 Depth (0일 경우 무한)
   */
  maximumMenuDepth?: number

  /**
   * 최대 권한 그룹 Depth (0일 경우 무한)
   */
  maximumAuthGroupDepth?: number

  /**
   * 권한 승인 사용 여부
   * @deprecated
   */
  useAuthApproval?: boolean

  /**
   * 권한 승인 유형
   */
  authApprovalType?: 'NONE' | 'ASSIGNED_GROUP' | 'CUSTOM_BY_GROUP'

  /**
   * 사용자 승인 기능 사용 여부
   */
  useUserApproval?: boolean

  /**
   * 개인 정보 처리 시스템 여부
   */
  isPersonalInfoSystem?: boolean

  /**
   * 비밀번호 변경 일자 (0일 경우 변경 안함)
   */
  passwordChangeDays?: number

  /**
   * 비밀번호 최소 자릿수
   */
  minimumPasswordLength?: number

  /**
   * 사용 불가 사용자 아이디 목록
   */
  ignoreUserIds?: string[]

  /**
   * 최대 로그인 실패 수 (계정 잠김 처리될 실패 건수)
   */
  maximumLoginFailNumbers?: number

  /**
   * 메뉴 아이콘 파일 그룹 아이디
   */
  menuIconFileGroupId?: string

  /**
   * 권한 그룹 권한 등록 시 사용자 권한 삭제 여부
   */
  isRemoveUserAuthWhenGroupRegisterred?: boolean

  /**
   * 휴면 상태로 자동 변경할 일수 (0일 경우 하지 않음.)
   */
  autoChangeDormancyDays?: number

  /**
   * 사용자 삭제 가능 여부
   */
  isRemovableUser?: boolean

  /**
   * 사용자 부서코드 셀렉트박스 사용 여부
   */
  useUserDeptCodeSelectBox?: boolean

  /**
   * 사용자 정보 수정 시 권한 정보 수정 가능 여부
   */
  canUpdateAuthWhenEditUser?: boolean

  /**
   * 추가 권한 역할 설정 기능 사용 여부
   */
  useAdditionalAuthRole?: boolean

  /**
   * 추가 권한 역할을 그룹에 설정 기능 사용 여부
   */
  useAdditionalAuthGroupRole?: boolean

  /**
   * 사용자가 요청 가능한 권한 그룹 지정 기능 사용 여부
   */
  useUserRequestableAuthGroup?: boolean

  /**
   * 사용자 구분에 따라 권한 그룹 배정 제약 처리를 할지 여부
   */
  limitAuthGroupByUserType?: boolean

  /**
   * 하나의 권한 그룹 배정 여부
   */
  hasOnlyOneAuthorityGroup?: boolean

  /**
   * 사용자 메뉴 시스템 코드 사용 여부
   */
  userMenuIncludeSystemCode?: boolean

  /**
   * 사용자의 권한 그룹 배정을 변경 가능한지 여부
   */
  canEditAuthGroupOfUser?: boolean

  /**
   * 메뉴 가이드 사용 여부
   */
  useMenuGuide?: boolean

  /**
   * 개인 정보 접근 로그 사용 여부
   */
  writePrivateInfoAccessLog?: boolean

  /**
   * 사용자 즐겨 찾기 사용 여부
   */
  useUserFavoriteMenu?: boolean

  /**
   * 개인 정보 변경 가능 여부
   */
  canUpdatePrivateInfo?: boolean

  /**
   * 사용자의 비밀번호 변경 가능 여부
   */
  canUpdateUserPassword?: boolean

  /**
   * 사용자 휴면 처리 스케쥴 사용 여부
   */
  useInactivatedUserUpdateSchedule?: boolean

  /**
   * 임시 파일 업로드 사용 여부
   */
  useTemporaryFileUpload?: boolean

  /**
   * 파일 접근 URL 저장 여부
   */
  storeFileAccessUrl?: boolean

  /**
   * 사용자별 권한 배정 가능 여부
   */
  canHasAuthorityByUser?: boolean

  /**
   * 사용자 권한 그룹 배정 가능 여부
   */
  canAssignUserInAuthorityGroup?: boolean

  /**
   * 메뉴 디바이스 범위 설정 사용 여부
   */
  useMenuDeviceScopeConfig?: boolean
}

/**
 * 초기 데이터
 */
export interface InitialData {
  /**
   * 공통 코드 목록
   */
  commonCodes: Code[]

  /**
   * 메뉴 목록
   */
  menus: Menu[]

  /**
   * 현재 시스템 코드
   */
  currentSystemCode: string

  /**
   * 어플리케이션 설정
   */
  appProp: ServerAppProps

  /**
   * 프로젝트 기타 설정
   */
  projectProp: any

  /**
   * 코드 매핑 룰
   */
  codeMappingRules: Record<string, string>

  /**
   * 파일 그룹 목록
   */
  fileGroups: FileGrp[]
}

/**
 * Mangement 초기 데이터 조회 서비스
 */
export const useUstraInitialDataService = defineUstraService(({ $ustra, api, appProps }) => {
  /**
   * 초기 데이터 조회
   */
  async function getInitialData() {
    const result = await api.call<apiModels.ApiResponse<InitialData>>({
      url: appProps.nuxt.management.initialData.initialDataApiUrl,
      method: 'POST',
      data: {},
      excludeAuthValidation: true,
    })

    if (result.data?.body) {
      // exclude fields
      if (result.data.body.commonCodes) {
        result.data.body.commonCodes.forEach(row => {
          row = $ustra.utils.objects.omit(
            row,
            'regDttm',
            'regUsrId',
            'regUsrIp',
            'updDttm',
            'updUsrId',
            'updUsrIp',
            'lclsCd',
            'lclsNm',
            'mclsNm',
            'rmk',
          )
          row = $ustra.utils.objects.excludeEmpty(row)
        })
      }

      if (result.data.body.menus) {
        result.data.body.menus.forEach(row => {
          row = $ustra.utils.objects.omit(row, 'regDttm', 'regUsrId', 'regUsrIp', 'updDttm', 'updUsrId', 'updUsrIp')
          row = $ustra.utils.objects.excludeEmpty(row)
        })
      }

      if (result.data.body.fileGroups) {
        result.data.body.fileGroups.forEach(row => {
          row = $ustra.utils.objects.omit(row, 'regDttm', 'regUsrId', 'regUsrIp', 'updDttm', 'updUsrId', 'updUsrIp')
          row = $ustra.utils.objects.excludeEmpty(row)
        })
      }
    }

    return result.data?.body
  }

  return { getInitialData }
})
