/**
 * progress hook 정의
 * @exports {@link UstraManagementInitialDataLoaded}
 * @packageDocumentation
 */
import { InitialData } from '#ustra/nuxt/management/services/common/initial-data'

/**
 * 초기 데이터 로드
 */
export interface UstraManagementInitialDataLoaded {
  /**
   * dataSource 유형
   *  - realtime : 실시간
   *  - cached : 캐시 데이터
   */
  sourceType: 'realtime' | 'cached'

  /**
   * 초기 데이터
   */
  data?: InitialData
}
