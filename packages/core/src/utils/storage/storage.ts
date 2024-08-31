export default abstract class Storage {
  private storedKeySet = new Set<string>()

  /**
   * key 추가
   * @param key 데이터 키
   */
  protected addKey(key: string) {
    this.storedKeySet.add(key)
  }

  /**
   * 키 제거
   * @param key 데이터 키
   */
  protected removeKey(key: string) {
    this.storedKeySet.delete(key)
  }

  /**
   * 데이터 조회
   * @param key 데이터 키
   */
  abstract getItem(key: string): any

  /**
   * 데이터 저장
   * @param key 데이터 키
   * @param value 데이터 값
   */
  abstract setItem(key: string, value: any): void

  /**
   * 데이터 삭제
   * @param key 데이터 키
   */
  abstract removeItem(key: string): void

  /**
   * 모든 데이터 제거
   */
  clearItem(): void {
    for (const key of this.storedKeySet) {
      this.removeItem(key)
      this.removeKey(key)
    }
  }
}
