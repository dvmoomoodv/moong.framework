import { useUstraManagement } from './ustra'
import { useUstraCodeValue } from './utils'
import { User } from '../models/user'

/**
 * 사용자 부서 명 조회
 * @param userInfo 사용자 정보
 */
export function useUstraUserDeptName(userInfo: User): string
/**
 * 사용자 부서 명 조회
 * @param deptCd 부서 코드
 * @param deptNm 부서 명
 */
export function useUstraUserDeptName(deptCd: string, deptNm: string): string
/**
 * 사용자 부서 명 조회
 * @param userInfoOrDeptCd 부서 코드 또는 사용자 정보
 * @param deptNm 부서 명
 * @returns
 */
export function useUstraUserDeptName(userInfoOrDeptCd: User | string, deptNm?: string) {
  const initData = useUstraManagement().store.initData

  const deptCd = typeof userInfoOrDeptCd === 'object' ? userInfoOrDeptCd.deptCd : (userInfoOrDeptCd as string)
  deptNm = typeof userInfoOrDeptCd === 'object' ? userInfoOrDeptCd.deptNm : deptNm

  return initData.serverAppProps.useUserDeptCodeSelectBox ? useUstraCodeValue('DEPT_CD', deptCd) : deptNm
}
