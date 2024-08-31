import { interfaceModels } from "#moong/core/data";

/**
 * interface option
 */
export interface Interface extends Record<string, any> {
  /**
   * 인터페이스 정보 조회 API URL
   */
  initialDataApiUrl?: string;

  /**
   * API 로깅
   */
  apiLogging?: {
    /**
     * 요청 로깅 주소 경로
     */
    reqLoggingUrl?: string;

    /**
     * 응답 로깅 주소 경로
     */
    resLoggingUrl?: string;
  };

  /**
   * 인터페이스 정의 정보
   */
  definitions?: Partial<interfaceModels.InterfaceInfo>[];
}
