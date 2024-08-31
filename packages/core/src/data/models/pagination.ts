/**
 * 페이지 요청 인터페이스
 */
export interface PaginationRequest {
  /**
   * 현재 페이지
   */
  currentPage?: number

  /**
   * 페이지 사이즈
   */
  pageSize?: number

  /**
   * 정렬
   */
  orders?: Order[]
}

/**
 * 정렬 설정
 */
export interface Order {
  /**
   * 필드 명
   */
  name: string

  /**
   * 정렬 순번
   */
  direction: 'ASC' | 'DESC'
}

/**
 * 페이징 결과
 */
export interface PaginationResponse<T = any> {
  /**
   * 목록 정보
   */
  list: Array<T>

  /**
   * 페이징 정보
   */
  pagination: {
    /**
     * 현재 페이지
     */
    page: number

    /**
     * 페이지 사이즈
     */
    limit: number

    /**
     * 총 데이터 수
     */
    totalCount: number
  }
}
