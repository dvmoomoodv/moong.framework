/**
 * Path 관련 공통 사용 유틸리티
 * @packageDocumentation
 */
// import micromatch from 'micromatch'
import AntPathMatcher from '@howiefh/ant-path-matcher'

export class Path {
  private antPathMatcher: AntPathMatcher = new AntPathMatcher()

  /**
   * 검색 경로가 패턴에 일치하는지 여부 검사
   * @param searchPath 검색 경로
   * @param patterns 패턴 목록
   * @returns 일치 여부
   */
  isMatchPatterns(searchPath: string, ...patterns: string[]) {
    if (!searchPath || !patterns || patterns.length < 1) {
      return false
    }

    for (let pattern of patterns) {
      if (pattern && pattern.startsWith('**')) {
        pattern = '/' + pattern
      }

      if (this.antPathMatcher.match(pattern, searchPath)) {
        return true
      }

      // if (micromatch.isMatch(searchPath, pattern)) {
      //   return true
      // }
    }

    return false
  }

  /**
   * 경로를 조인
   * @param path 경로
   * @param paths join할 경로 목록
   */
  join(path: string, ...paths: string[]) {
    path = path || ''

    paths.forEach(p => {
      path += path.endsWith('/') ? p : '/' + p
    })

    return path
  }

  /**
   * 경로에서 확장자를 제거
   * @param path 경로
   */
  withoutExt(path: string) {
    if (!path) {
      return path
    }

    const paths = path.split('.')

    if (paths.length < 2) {
      return path
    }

    paths.splice(-1, 1)
    return paths.join('.')
  }
}

const instance = new Path()
export default instance
